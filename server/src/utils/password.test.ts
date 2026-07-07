import { describe, expect, it } from 'vitest';
import { validatePassword } from './password.js';

describe('validatePassword', () => {
  it('rejects short passwords', () => {
    expect(validatePassword('abc1')).toMatch(/at least 8/);
  });

  it('rejects passwords without letters', () => {
    expect(validatePassword('12345678')).toMatch(/letter/);
  });

  it('rejects passwords without numbers', () => {
    expect(validatePassword('password')).toMatch(/number/);
  });

  it('accepts valid passwords', () => {
    expect(validatePassword('password1')).toBeNull();
    expect(validatePassword('SkillNet99')).toBeNull();
  });
});
