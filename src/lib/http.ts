import { env } from "./env";

const RETRY_DELAYS_MS = [0, 300, 900];

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type AuthHandlers = {
  getAccessToken?: () => string | null;
  refreshAccessToken?: () => Promise<string | null>;
  onAuthFailure?: () => void;
};

let authHandlers: AuthHandlers = {};

export const setAuthHandlers = (handlers: AuthHandlers) => {
  authHandlers = handlers;
};

export async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
  config?: { auth?: boolean }
): Promise<T> {
  let lastError: unknown = null;
  const needsAuth = config?.auth ?? false;

  for (const delay of RETRY_DELAYS_MS) {
    if (delay) {
      await sleep(delay);
    }
    try {
      const authToken =
        token || (needsAuth && authHandlers.getAccessToken ? authHandlers.getAccessToken() : null);
      const response = await fetch(`${env.apiBaseUrl}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          ...(options.headers || {})
        }
      });

      if (response.status === 401 && needsAuth && authHandlers.refreshAccessToken) {
        const refreshed = await authHandlers.refreshAccessToken();
        if (refreshed) {
          return request<T>(path, options, refreshed, config);
        }
        authHandlers.onAuthFailure?.();
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new HttpError(
          payload.message || "Request failed. Please try again.",
          response.status
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
