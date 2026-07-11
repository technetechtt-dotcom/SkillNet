import { isProduction } from './env.js';

export async function sendSms(phone: string, message: string): Promise<{
  sent: boolean;
  provider: string;
  error?: string;
}> {
  const atUsername = process.env.AT_USERNAME;
  const atApiKey = process.env.AT_API_KEY;
  const atSender = process.env.AT_SENDER_ID || 'SkillNet';

  if (atUsername && atApiKey) {
    try {
      const body = new URLSearchParams({
        username: atUsername,
        to: phone,
        message,
        from: atSender,
      });

      const res = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          apiKey: atApiKey,
        },
        body,
      });

      const data = (await res.json()) as {
        SMSMessageData?: { Recipients?: { status: string }[] };
      };
      const status = data.SMSMessageData?.Recipients?.[0]?.status;
      if (status && /success/i.test(status)) {
        return { sent: true, provider: 'africastalking' };
      }
      return {
        sent: false,
        provider: 'africastalking',
        error: status || 'Africa\'s Talking send failed',
      };
    } catch (err) {
      console.error('Africa\'s Talking SMS error:', err);
      return {
        sent: false,
        provider: 'africastalking',
        error: err instanceof Error ? err.message : 'SMS failed',
      };
    }
  }

  if (process.env.SMS_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message }),
      });
      if (!res.ok) {
        return {
          sent: false,
          provider: 'webhook',
          error: `Webhook returned ${res.status}`,
        };
      }
      return { sent: true, provider: 'webhook' };
    } catch (err) {
      console.error('SMS webhook error:', err);
      return {
        sent: false,
        provider: 'webhook',
        error: err instanceof Error ? err.message : 'Webhook failed',
      };
    }
  }

  if (!isProduction || process.env.OTP_DEBUG === 'true') {
    console.log(`[SMS] ${phone}: ${message}`);
    return { sent: true, provider: 'console' };
  }

  return {
    sent: false,
    provider: 'none',
    error: 'No SMS provider configured (set AT_USERNAME/AT_API_KEY or SMS_WEBHOOK_URL)',
  };
}
