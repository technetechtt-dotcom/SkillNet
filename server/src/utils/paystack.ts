const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE = 'https://api.paystack.co';

export function isPaystackConfigured() {
  return !!PAYSTACK_SECRET;
}

export async function initializePayment(params: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl?: string;
}) {
  if (!PAYSTACK_SECRET) {
    return {
      devMode: true,
      reference: params.reference,
      authorizationUrl: null as string | null,
    };
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount * 100,
      reference: params.reference,
      callback_url: params.callbackUrl,
      currency: 'ZAR',
    }),
  });

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || 'Paystack initialization failed');
  }

  return {
    devMode: false,
    reference: data.data.reference,
    authorizationUrl: data.data.authorization_url as string,
  };
}

export async function verifyPayment(reference: string) {
  if (!PAYSTACK_SECRET) {
    return { success: true, amount: 0, devMode: true };
  }

  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    }
  );

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || 'Verification failed');
  }

  return {
    success: data.data.status === 'success',
    amount: Math.round(data.data.amount / 100),
    devMode: false,
  };
}
