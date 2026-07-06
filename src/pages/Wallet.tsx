import React, { useEffect, useState } from 'react';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  LandmarkIcon,
  PlusIcon,
  ShieldCheckIcon,
  CreditCardIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { WalletData } from '../types';
import { api } from '../services/api';

interface WalletProps {
  onWithdraw: () => void;
  onTransactionClick: (id: string) => void;
}
export function Wallet({ onWithdraw, onTransactionClick }: WalletProps) {
  const [data, setData] = useState<WalletData | null>(null);
  useEffect(() => {
    api.wallet().then(setData).catch(() => setData(null));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex-shrink-0 border-b border-border shadow-sm">
        <h1 className="text-2xl font-black text-text-primary tracking-tight">
          Wallet
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Balance Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-primary via-teal-600 to-teal-800 rounded-[2rem] p-7 text-white shadow-elevated relative overflow-hidden">
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />

            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 opacity-90">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide">
                    Available Balance
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>
              <h2 className="text-5xl font-black mb-8 tracking-tighter drop-shadow-md">
                {formatCurrency(data?.balance || 0)}
              </h2>

              <div className="flex gap-3">
                <button className="flex-1 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl py-3.5 px-2 flex flex-col items-center gap-1.5 backdrop-blur-md border border-white/10">
                  <PlusIcon className="w-6 h-6 text-emerald-300" />
                  <span className="text-xs font-bold">Add Money</span>
                </button>
                <button
                  onClick={onWithdraw}
                  className="flex-1 bg-white text-primary hover:bg-white/90 transition-colors rounded-2xl py-3.5 px-2 flex flex-col items-center gap-1.5 shadow-lg">

                  <LandmarkIcon className="w-6 h-6 text-amber-500" />
                  <span className="text-xs font-bold">Withdraw</span>
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl py-3.5 px-2 flex flex-col items-center gap-1.5 backdrop-blur-md border border-white/10">
                  <ArrowUpRightIcon className="w-6 h-6 text-blue-300" />
                  <span className="text-xs font-bold">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 mb-6">
          <div className="bg-surface rounded-3xl border border-border p-5 flex items-center justify-between shadow-card">
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">
                Earned this week
              </p>
              <p className="text-xl font-black text-text-primary">
                {formatCurrency(data?.weeklyEarned || 0)}
              </p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">
                Jobs completed
              </p>
              <p className="text-xl font-black text-text-primary">
                {data?.jobsCompleted || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-primary">
              Recent Transactions
            </h3>
            <button className="text-primary text-sm font-bold min-h-[44px] flex items-center hover:text-primary-dark transition-colors">
              See All
            </button>
          </div>

          <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-card">
            {(data?.transactions || []).map((tx, index) =>
            <button
              key={tx.id}
              onClick={() => onTransactionClick(tx.id)}
              className={`w-full flex items-center gap-4 p-4 text-left hover:bg-background transition-colors min-h-[76px] relative ${index !== (data?.transactions.length || 0) - 1 ? 'border-b border-border' : ''}`}>

                {/* Colored left border indicator */}
                <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${tx.type === 'received' ? 'bg-success' : tx.type === 'withdrawal' ? 'bg-warning' : 'bg-info'}`} />


                <div className="flex-shrink-0 pl-2">
                  {tx.avatar ?
                <UserAvatar
                  src={tx.avatar}
                  name={tx.title}
                  size="md"
                  className="shadow-sm" /> :


                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${tx.type === 'withdrawal' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : tx.type === 'received' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>

                      {tx.type === 'withdrawal' ?
                  <LandmarkIcon className="w-5 h-5" /> :
                  tx.type === 'received' ?
                  <ArrowDownLeftIcon className="w-5 h-5" /> :

                  <ArrowUpRightIcon className="w-5 h-5" />
                  }
                    </div>
                }
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text-primary truncate">
                    {tx.title}
                  </h4>
                  <p className="text-xs text-text-secondary font-medium mt-0.5">
                    {tx.date}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                  className={`font-black text-sm ${tx.amount > 0 ? 'text-success' : 'text-text-primary'}`}>

                    {tx.amount > 0 ? '+' : ''}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">
                    {tx.status}
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>);

}