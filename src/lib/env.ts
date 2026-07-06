const getEnv = (name: string, fallback: string): string => {
  const value = import.meta.env[name];
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }
  return value;
};

export const env = {
  apiBaseUrl: getEnv("VITE_API_BASE_URL", "http://localhost:4000")
};
