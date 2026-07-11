import { randomInt } from 'crypto';
import { and, desc, eq, gt } from 'drizzle-orm';
import { db } from '../db/index.js';
import { phoneOtps } from '../db/schema.js';
import { isProduction } from './env.js';
import { sendSms } from './sms.js';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function generateCode(): string {
  return String(randomInt(100000, 999999));
}

export async function createPhoneOtp(phone: string, purpose: 'login' | 'register') {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await db.insert(phoneOtps).values({
    phone,
    code,
    purpose,
    expiresAt,
  });

  if (!isProduction || process.env.OTP_DEBUG === 'true') {
    console.log(`[OTP] ${phone} (${purpose}): ${code}`);
  }

  const message = `Your SkillNet verification code is ${code}. It expires in 10 minutes.`;
  const sms = await sendSms(phone, message);

  if (!sms.sent && isProduction && process.env.OTP_DEBUG !== 'true') {
    console.error(`OTP SMS failed via ${sms.provider}:`, sms.error);
  }

  return { expiresAt, smsSent: sms.sent, smsProvider: sms.provider };
}

export async function verifyPhoneOtp(
  phone: string,
  code: string,
  purpose: 'login' | 'register'
): Promise<{ valid: boolean; error?: string }> {
  const [otp] = await db
    .select()
    .from(phoneOtps)
    .where(
      and(
        eq(phoneOtps.phone, phone),
        eq(phoneOtps.purpose, purpose),
        gt(phoneOtps.expiresAt, new Date())
      )
    )
    .orderBy(desc(phoneOtps.createdAt))
    .limit(1);

  if (!otp) {
    return { valid: false, error: 'Code expired or not found. Request a new one.' };
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    return { valid: false, error: 'Too many attempts. Request a new code.' };
  }

  if (otp.code !== code) {
    await db
      .update(phoneOtps)
      .set({ attempts: otp.attempts + 1 })
      .where(eq(phoneOtps.id, otp.id));
    return { valid: false, error: 'Invalid code' };
  }

  await db.delete(phoneOtps).where(eq(phoneOtps.id, otp.id));
  return { valid: true };
}
