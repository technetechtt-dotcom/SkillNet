import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'server/src/**/*.test.ts'],
    env: {
      JWT_SECRET: 'test-jwt-secret-for-vitest',
      NODE_ENV: 'test',
      DATABASE_URL:
        'postgresql://test:test@localhost/skillnet_test?sslmode=require',
    },
  },
});
