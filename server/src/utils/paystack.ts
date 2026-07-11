const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE = 'https://api.paystack.co';

export function isPaystackConfigured() {
  return !!PAYSTACK_SECRET;
}

async function paystackFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });
  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || `Paystack request failed: ${path}`);
  }
  return data;
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

  const data = await paystackFetch('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,
      amount: params.amount * 100,
      reference: params.reference,
      callback_url: params.callbackUrl,
      currency: 'ZAR',
    }),
  });

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

  const data = await paystackFetch(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );

  return {
    success: data.data.status === 'success',
    amount: Math.round(data.data.amount / 100),
    devMode: false,
  };
}

export async function listBanks(country = 'south africa') {
  if (!PAYSTACK_SECRET) {
    return {
      devMode: true,
      banks: [
        { name: 'FNB', code: '250655', slug: 'fnb' },
        { name: 'Standard Bank', code: '051001', slug: 'standard-bank' },
        { name: 'ABSA', code: '632005', slug: 'absa' },
        { name: 'Nedbank', code: '198765', slug: 'nedbank' },
        { name: 'Capitec', code: '470010', slug: 'capitec' },
      ],
    };
  }

  const data = await paystackFetch(
    `/bank?country=${encodeURIComponent(country)}&currency=ZAR`
  );

  return {
    devMode: false,
    banks: (data.data as { name: string; code: string; slug: string }[]).map(
      (b) => ({
        name: b.name,
        code: b.code,
        slug: b.slug,
      })
    ),
  };
}

export async function createTransferRecipient(params: {
  name: string;
  accountNumber: string;
  bankCode: string;
}) {
  if (!PAYSTACK_SECRET) {
    return {
      devMode: true,
      recipientCode: `RCP_DEV_${Date.now()}`,
    };
  }

  const data = await paystackFetch('/transferrecipient', {
    method: 'POST',
    body: JSON.stringify({
      type: process.env.PAYSTACK_TRANSFER_TYPE || 'basa',
      name: params.name,
      account_number: params.accountNumber,
      bank_code: params.bankCode,
      currency: 'ZAR',
    }),
  });

  return {
    devMode: false,
    recipientCode: data.data.recipient_code as string,
  };
}

export async function initiateTransfer(params: {
  amount: number;
  recipientCode: string;
  reference: string;
  reason?: string;
}) {
  if (!PAYSTACK_SECRET) {
    return {
      devMode: true,
      transferCode: `TRF_DEV_${Date.now()}`,
      status: 'success',
    };
  }

  const data = await paystackFetch('/transfer', {
    method: 'POST',
    body: JSON.stringify({
      source: 'balance',
      amount: params.amount * 100,
      recipient: params.recipientCode,
      reference: params.reference,
      reason: params.reason || 'SkillNet wallet withdrawal',
      currency: 'ZAR',
    }),
  });

  return {
    devMode: false,
    transferCode: data.data.transfer_code as string,
    status: data.data.status as string,
  };
}
