import React, { useState } from 'react';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ArrowLeftIcon,
  LandmarkIcon,
  PlusIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  FileTextIcon,
  ChevronRightIcon } from
'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserAvatar } from '../components/ui/UserAvatar';
import { api } from '../lib/api';

interface WalletProps {
  onWithdraw: () => void;
  onTransactionClick: (id: string) => void;
  onInvoices?: () => void;
  onAddMoney?: () => void;
  onSendMoney?: () => void;
  onBack?: () => void;
}
export function Wallet({
  onWithdraw,
  onTransactionClick,
  onInvoices,
  onAddMoney,
  onSendMoney,
  onBack
}: WalletProps) {
  const [showingAll, setShowingAll] = useState(false);

  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.wallet.get(),
  });

  const { data: stats } = useQuery({
    queryKey: ['wallet', 'stats'],
    queryFn: () => api.wallet.stats(),
  });

  const transactions = wallet?.transactions ?? [];
  const displayTransactions = showingAll ? transactions : transactions.slice(0, 3);

  const formatCurrency = (amount: number) => {
    const currency = wallet?.currency || 'ZAR';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex-shrink-0 border-b border-border shadow-sm flex items-center gap-3">
        {onBack &&
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        }
        <h1 className="text-2xl font-black text-text-primary tracking-tight">
          Wallet
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Balance Card */}
        <div className="p-4">
          {isLoading ?
          <div className="h-64 bg-surface rounded-[2rem] border border-border shadow-sm animate-pulse p-7 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-border rounded-md w-32"></div>
                <div className="h-6 bg-border rounded-lg w-16"></div>
              </div>
              <div className="h-12 bg-border rounded-lg w-48"></div>
              <div className="flex gap-3">
                <div className="flex-1 h-16 bg-border rounded-2xl"></div>
                <div className="flex-1 h-16 bg-border rounded-2xl"></div>
                <div className="flex-1 h-16 bg-border rounded-2xl"></div>
              </div>
            </div> :

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
                  {wallet?.formattedBalance || 'R0'}
                </h2>

                <div className="flex gap-3">
                  <button
                  onClick={() => onAddMoney?.()}
                  className="flex-1 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl py-3.5 px-2 flex flex-col items-center gap-1.5 backdrop-blur-md border border-white/10">
                  
                    <PlusIcon className="w-6 h-6 text-emerald-300" />
                    <span className="text-xs font-bold">Add Money</span>
                  </button>
                  <button
                  onClick={onWithdraw}
                  className="flex-1 bg-white text-primary hover:bg-white/90 transition-colors rounded-2xl py-3.5 px-2 flex flex-col items-center gap-1.5 shadow-lg">
                  
                    <LandmarkIcon className="w-6 h-6 text-amber-500" />
                    <span className="text-xs font-bold">Withdraw</span>
                  </button>
                  <button
                  onClick={() => onSendMoney?.()}
                  className="flex-1 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl py-3.5 px-2 flex flex-col items-center gap-1.5 backdrop-blur-md border border-white/10">
                  
                    <ArrowUpRightIcon className="w-6 h-6 text-blue-300" />
                    <span className="text-xs font-bold">Send</span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Quick Stats */}
        <div className="px-4 mb-6">
          <div className="bg-surface rounded-3xl border border-border p-5 flex items-center justify-between shadow-card">
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">
                Earned this week
              </p>
              <p className="text-xl font-black text-text-primary">
                {stats?.formattedWeeklyEarned || 'R0'}
              </p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">
                Jobs completed
              </p>
              <p className="text-xl font-black text-text-primary">
                {stats?.jobsCompleted ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        {/* Invoices & Quotes Entry */}
        <div className="px-4 mb-6">
          <button
            onClick={onInvoices}
            className="w-full bg-surface rounded-3xl border border-border p-4 flex items-center justify-between shadow-sm hover:shadow-card transition-all group">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileTextIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-text-primary text-base">
                  Invoices & Quotes
                </h3>
                <p className="text-xs text-text-secondary font-medium mt-0.5">
                  Manage billing and send quotes
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors">
              <ChevronRightIcon className="w-4 h-4 text-text-secondary group-hover:text-primary" />
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="px-4 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-text-primary">
              Recent Transactions
            </h3>
            <button
              onClick={() => setShowingAll(!showingAll)}
              className="text-primary text-sm font-bold min-h-[44px] flex items-center hover:text-primary-dark transition-colors">
              
              {showingAll ? 'Show Less' : 'See All'}
            </button>
          </div>

          <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-card">
            {isLoading ?
            <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) =>
              <div
                key={i}
                className="flex items-center gap-4 animate-pulse">
                
                    <div className="w-10 h-10 rounded-xl bg-border"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-border rounded-md w-3/4"></div>
                      <div className="h-3 bg-border rounded-md w-1/2"></div>
                    </div>
                    <div className="space-y-2 items-end flex flex-col">
                      <div className="h-4 bg-border rounded-md w-16"></div>
                      <div className="h-3 bg-border rounded-md w-12"></div>
                    </div>
                  </div>
              )}
              </div> :

            <div className="p-4">
                {displayTransactions.map((tx, index, arr) =>
              <button
                key={tx.id}
                onClick={() => onTransactionClick(tx.id)}
                className={`w-full flex items-center gap-4 p-4 text-left hover:bg-background transition-colors min-h-[76px] relative ${index !== arr.length - 1 ? 'border-b border-border' : ''}`}>
                
                    <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${tx.type === 'credit' ? 'bg-success' : tx.type === 'withdrawal' ? 'bg-warning' : 'bg-info'}`} />

                    <div className="flex-shrink-0 pl-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${tx.type === 'withdrawal' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    
                          {tx.type === 'withdrawal' ?
                    <LandmarkIcon className="w-5 h-5" /> :
                    tx.type === 'credit' ?
                    <ArrowDownLeftIcon className="w-5 h-5" /> :

                    <ArrowUpRightIcon className="w-5 h-5" />
                    }
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-text-primary truncate">
                        {tx.description || tx.type}
                      </h4>
                      <p className="text-xs text-text-secondary font-medium mt-0.5">
                        {tx.time}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                    className={`font-black text-sm ${tx.type === 'credit' ? 'text-success' : 'text-text-primary'}`}>
                    
                        {tx.type === 'credit' ? '+' : '-'}
                        {tx.formattedAmount}
                      </p>
                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">
                        {tx.status}
                      </p>
                    </div>
                  </button>
              )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}