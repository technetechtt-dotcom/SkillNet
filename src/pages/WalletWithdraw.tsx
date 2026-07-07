import React, { useState } from 'react';
import { ArrowLeftIcon, LandmarkIcon, SmartphoneIcon } from 'lucide-react';
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
  const [method, setMethod] = useState<'bank' | 'mobile'>('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.wallet.get(),
  });

  const balance = wallet?.balance ?? 0;
  const numAmount = parseInt(amount.replace(/,/g, '') || '0');
  const isValid = numAmount > 0 && numAmount <= balance;

  const handleWithdraw = async () => {
    setIsProcessing(true);
    setError('');
    try {
      await api.wallet.withdraw(
        numAmount,
        method === 'bank' ? 'GTBank' : 'Mobile Money',
        '4567'
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
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Withdraw Funds</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Amount Input */}
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
              className="bg-transparent border-none focus:outline-none w-32 text-center p-0" />
            
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
          {numAmount > balance &&
          <p className="text-xs text-error mt-2 font-medium">
              Amount exceeds available balance
            </p>
          }
        </div>

        {/* Withdrawal Method */}
        <h3 className="text-sm font-bold text-text-primary mb-3 px-1">
          Withdrawal Method
        </h3>
        <div className="space-y-3 mb-8">
          <button
            onClick={() => setMethod('bank')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors min-h-[72px] text-left ${method === 'bank' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
            
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'bank' ? 'bg-primary text-white' : 'bg-background text-text-secondary'}`}>
              
              <LandmarkIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-primary text-sm">
                Bank Account
              </h4>
              <p className="text-xs text-text-secondary">GTBank •••• 4567</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'bank' ? 'border-primary' : 'border-border'}`}>
              
              {method === 'bank' &&
              <div className="w-2.5 h-2.5 bg-primary rounded-full" />
              }
            </div>
          </button>

          <button
            onClick={() => setMethod('mobile')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors min-h-[72px] text-left ${method === 'mobile' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
            
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${method === 'mobile' ? 'bg-primary text-white' : 'bg-background text-text-secondary'}`}>
              
              <SmartphoneIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-primary text-sm">
                Mobile Money
              </h4>
              <p className="text-xs text-text-secondary">Add new number</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'mobile' ? 'border-primary' : 'border-border'}`}>
              
              {method === 'mobile' &&
              <div className="w-2.5 h-2.5 bg-primary rounded-full" />
              }
            </div>
          </button>
        </div>

        <ActionButton
          onClick={handleWithdraw}
          disabled={!isValid}
          loading={isProcessing}>
          
          Confirm Withdrawal
        </ActionButton>
      </div>
    </div>);

}