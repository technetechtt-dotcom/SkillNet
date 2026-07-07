import { describe, expect, it } from 'vitest';
import { env } from './env';

describe('env', () => {
  it('provides API base url', () => {
    expect(env.apiBaseUrl).toBeTruthy();
  });
});
