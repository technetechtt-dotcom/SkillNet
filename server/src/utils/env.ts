export const isProduction = process.env.NODE_ENV === 'production';

export function requireProductionEnv(name: string): string {
  const value = process.env[name];
  if (!value && isProduction) {
    console.error(`FATAL: ${name} is required in production`);
    process.exit(1);
  }
  return value || '';
}
