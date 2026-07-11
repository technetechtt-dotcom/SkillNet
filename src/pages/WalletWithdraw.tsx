import React, { useState } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';

interface WalletWithdrawProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function WalletWithdraw({ onBack, onSuccess }: WalletWithdrawProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.wallet.get(),
  });

  const { data: banksData } = useQuery({
    queryKey: ['wallet', 'banks'],
    queryFn: () => api.wallet.banks(),
  });

  const balance = wallet?.balance ?? 0;
  const numAmount = parseInt(amount.replace(/,/g, '') || '0', 10);
  const selectedBank = banksData?.banks.find((b) => b.code === bankCode);
  const isValid =
    numAmount > 0 &&
    numAmount <= balance &&
    !!bankCode &&
    accountNumber.trim().length >= 6;

  const handleWithdraw = async () => {
    if (!isValid) return;
    setIsProcessing(true);
    setError('');
    try {
      await api.wallet.withdraw(
        numAmount,
        selectedBank?.name || 'Bank',
        accountNumber.trim(),
        bankCode,
        accountName.trim() || undefined
      );
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Withdraw Funds</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-surface rounded-2xl border border-border p-6 mb-6 text-center">
          <p className="text-sm font-medium text-text-secondary mb-4">
            Enter Amount
          </p>
          <div className="flex items-center justify-center text-4xl font-bold text-text-primary mb-4">
            <span className="text-text-secondary mr-1">R</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent border-none focus:outline-none w-32 text-center p-0"
            />
          </div>
          <p className="text-sm text-text-secondary">
            Available Balance:{' '}
            <span className="font-bold text-text-primary">
              {wallet?.formattedBalance || 'R0'}
            </span>
          </p>
          {error && (
            <p className="text-xs text-error mt-2 font-medium">{error}</p>
          )}
          {numAmount > balance && (
            <p className="text-xs text-error mt-2 font-medium">
              Amount exceeds available balance
            </p>
          )}
        </div>

        <h3 className="text-sm font-bold text-text-primary mb-3 px-1">
          Bank Details
        </h3>
        <div className="space-y-3 mb-8">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Bank
            </label>
            <select
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary">
              <option value="">Select bank</option>
              {(banksData?.banks || []).map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Account number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Account name (optional)
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Name on the account"
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <ActionButton
          onClick={handleWithdraw}
          disabled={!isValid}
          loading={isProcessing}>
          Confirm Withdrawal
        </ActionButton>
      </div>
    </div>
  );
}
