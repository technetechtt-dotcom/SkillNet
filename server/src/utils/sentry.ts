import * as Sentry from '@sentry/node';

let sentryInitialized = false;

export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn || sentryInitialized) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
  sentryInitialized = true;
}

export function captureException(error: unknown): void {
  if (!sentryInitialized) return;
  Sentry.captureException(error);
}
