const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
  KES: 'KSh ',
  GHS: 'GH₵ ',
  ZAR: 'R',
};

export function formatPayment(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
  return `${symbol}${amount.toLocaleString()}`;
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}
