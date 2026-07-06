import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  LandmarkIcon,
  CopyIcon,
  HelpCircleIcon,
} from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { api } from '../lib/api';

interface TransactionDetailProps {
  transactionId: string;
  onBack: () => void;
}

export function TransactionDetail({
  transactionId,
  onBack,
}: TransactionDetailProps) {
  const { data: tx, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => api.wallet.getTransaction(transactionId),
  });

  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const handleCopy = () => {
    if (tx?.ref) navigator.clipboard.writeText(tx.ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !tx) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-text-primary">
            Transaction Details
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-surface rounded-3xl p-8 flex flex-col items-center justify-center border border-border shadow-sm mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${tx.type === 'withdrawal' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : tx.type === 'received' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
            {tx.type === 'withdrawal' ? (
              <LandmarkIcon className="w-8 h-8" />
            ) : tx.type === 'received' ? (
              <ArrowDownLeftIcon className="w-8 h-8" />
            ) : (
              <ArrowUpRightIcon className="w-8 h-8" />
            )}
          </div>
          <h2
            className={`text-4xl font-black mb-2 ${tx.amount > 0 ? 'text-success' : 'text-text-primary'}`}>
            {tx.amount > 0 ? '+' : '-'}
            {formatCurrency(tx.amount)}
          </h2>
          <div className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {tx.status}
          </div>
        </div>

        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm mb-6">
          <div className="p-5 border-b border-border">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
              Transaction Info
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary font-medium">
                  {tx.type === 'received' ? 'From' : 'To'}
                </span>
                <div className="flex items-center gap-2">
                  {tx.avatar && (
                    <UserAvatar src={tx.avatar} name={tx.title} size="sm" />
                  )}
                  <span className="font-bold text-sm text-text-primary">
                    {tx.title.replace(
                      /Payment from |Withdrawal to |Sent to /,
                      ''
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary font-medium">
                  Date & Time
                </span>
                <span className="font-bold text-sm text-text-primary">
                  {tx.date}
                </span>
              </div>
              {tx.bankDetails && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary font-medium">
                    Bank Account
                  </span>
                  <span className="font-bold text-sm text-text-primary">
                    {tx.bankDetails}
                  </span>
                </div>
              )}
              {tx.jobRef && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary font-medium">
                    Job Reference
                  </span>
                  <span className="font-bold text-sm text-text-primary truncate max-w-[150px]">
                    {tx.jobRef}
                  </span>
                </div>
              )}
              {tx.note && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary font-medium">
                    Note
                  </span>
                  <span className="font-bold text-sm text-text-primary">
                    {tx.note}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="p-5 bg-background/50">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-text-secondary font-medium block mb-1">
                  Reference Number
                </span>
                <span className="font-mono font-bold text-sm text-text-primary">
                  {tx.ref}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 bg-surface rounded-lg border border-border text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                {copied ? (
                  <span className="text-xs font-bold text-success">Copied!</span>
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setReported(true)}
          disabled={reported}
          className={`w-full rounded-2xl border p-4 flex items-center justify-between transition-colors shadow-sm ${reported ? 'bg-success/5 border-success/20' : 'bg-surface border-border hover:bg-background'}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${reported ? 'bg-success/10' : 'bg-primary/10'}`}>
              <HelpCircleIcon
                className={`w-5 h-5 ${reported ? 'text-success' : 'text-primary'}`}
              />
            </div>
            <div className="text-left">
              <span
                className={`font-bold text-sm block ${reported ? 'text-success-dark dark:text-success' : 'text-text-primary'}`}>
                {reported ? 'Issue Reported' : 'Report an issue'}
              </span>
              <span className="text-xs text-text-secondary font-medium">
                {reported
                  ? 'Support will contact you shortly.'
                  : 'Having trouble with this transaction?'}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
