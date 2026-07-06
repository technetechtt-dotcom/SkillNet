import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, SendIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';

interface WalletActionProps {
  actionType: 'add' | 'send';
  onBack: () => void;
}

export function WalletAction({ actionType, onBack }: WalletActionProps) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdd = actionType === 'add';

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference || !isAdd) return;

    (async () => {
      try {
        await api.wallet.paystackVerify(reference);
        queryClient.invalidateQueries({ queryKey: ['wallet'] });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onBack();
        }, 2000);
      } catch {
        setError('Payment verification failed');
      }
    })();
  }, [searchParams, isAdd, queryClient, onBack]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const numAmount = Number(amount);
      if (isAdd) {
        const init = await api.wallet.paystackInitialize(numAmount);
        if (init.devMode || !init.authorizationUrl) {
          await api.wallet.paystackVerify(init.reference);
        } else {
          window.location.href = init.authorizationUrl;
          return;
        }
      } else {
        await api.wallet.send(numAmount, recipient);
      }
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex items-center p-4 border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 mr-2">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary flex-1">
          {isAdd ? 'Add Money' : 'Send Money'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {isAdd && (
          <p className="text-xs text-text-secondary text-center mb-4">
            Secure payment via Paystack. Dev mode credits instantly without keys.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-border text-center">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Amount (ZAR)
            </label>
            <div className="flex items-center justify-center text-4xl font-bold text-text-primary">
              <span className="mr-1">R</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent border-none outline-none w-32 text-center placeholder:text-text-secondary/50"
                required
                min="1"
              />
            </div>
          </div>

          {!isAdd && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="+27821234567"
                className="w-full bg-surface border border-border rounded-xl p-4 text-text-primary outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
            {isAdd ? <PlusIcon className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
            {isSubmitting
              ? 'Processing...'
              : isAdd
                ? 'Pay with Paystack'
                : 'Send Money'}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {isAdd ? 'Funds added!' : 'Money sent!'}
          </p>
        </div>
      )}
    </div>
  );
}
