import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  PlusIcon,
  FileTextIcon,
  FileCheckIcon,
  ClockIcon,
  CheckCircleIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { FilterChip } from '../components/ui/FilterChip';
interface InvoiceListProps {
  onBack: () => void;
  onCreateNew: () => void;
  onInvoiceClick: (id: string) => void;
}
// Mock Data
export const MOCK_INVOICES = [
{
  id: 'inv1',
  type: 'invoice',
  number: 'INV-2026-001',
  clientName: 'TechHub Ltd',
  clientAvatar: 'https://i.pravatar.cc/150?u=techhub',
  amount: 45000,
  status: 'paid',
  date: 'Mar 1, 2026',
  dueDate: 'Mar 15, 2026'
},
{
  id: 'inv2',
  type: 'invoice',
  number: 'INV-2026-002',
  clientName: 'Grace Wanjiku',
  clientAvatar: 'https://i.pravatar.cc/150?u=grace',
  amount: 15000,
  status: 'sent',
  date: 'Mar 5, 2026',
  dueDate: 'Mar 19, 2026'
},
{
  id: 'quo1',
  type: 'quote',
  number: 'QUO-2026-001',
  clientName: 'David Omondi',
  amount: 120000,
  status: 'draft',
  date: 'Mar 8, 2026',
  dueDate: 'Mar 22, 2026'
},
{
  id: 'inv3',
  type: 'invoice',
  number: 'INV-2026-003',
  clientName: 'Sarah Jenkins',
  amount: 35000,
  status: 'overdue',
  date: 'Feb 10, 2026',
  dueDate: 'Feb 24, 2026'
}];

const STATUS_CONFIG = {
  paid: {
    label: 'Paid',
    color: 'bg-success/10 text-success-dark dark:text-success',
    icon: CheckCircleIcon
  },
  sent: {
    label: 'Sent',
    color: 'bg-info/10 text-info-dark dark:text-info',
    icon: FileCheckIcon
  },
  draft: {
    label: 'Draft',
    color: 'bg-surface border border-border text-text-secondary',
    icon: FileTextIcon
  },
  overdue: {
    label: 'Overdue',
    color: 'bg-error/10 text-error-dark dark:text-error',
    icon: ClockIcon
  }
};
export function InvoiceList({
  onBack,
  onCreateNew,
  onInvoiceClick
}: InvoiceListProps) {
  const [activeTab, setActiveTab] = useState('All');
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };
  const filteredInvoices = MOCK_INVOICES.filter((inv) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Invoices') return inv.type === 'invoice';
    if (activeTab === 'Quotes') return inv.type === 'quote';
    return true;
  });
  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary">
              Invoices & Quotes
            </h1>
            <p className="text-xs text-text-secondary font-medium mt-0.5">
              Manage your billing
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-4 py-3 border-b border-border bg-surface flex-shrink-0">
        {['All', 'Invoices', 'Quotes'].map((tab) =>
        <FilterChip
          key={tab}
          label={tab}
          selected={activeTab === tab}
          onToggle={() => setActiveTab(tab)} />

        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredInvoices.length === 0 ?
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
              <FileTextIcon className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              No items found
            </h3>
            <p className="text-sm text-text-secondary max-w-[250px]">
              You don't have any {activeTab.toLowerCase()} yet. Create one to
              get started.
            </p>
          </div> :

        filteredInvoices.map((inv) => {
          const statusConfig =
          STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG];
          const StatusIcon = statusConfig.icon;
          return (
            <button
              key={inv.id}
              onClick={() => onInvoiceClick(inv.id)}
              className="w-full bg-surface rounded-2xl p-4 border border-border flex flex-col gap-3 hover:border-primary/30 transition-colors text-left shadow-sm">
              
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    {inv.clientAvatar ?
                  <UserAvatar
                    src={inv.clientAvatar}
                    name={inv.clientName}
                    size="sm" /> :


                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {inv.clientName.charAt(0)}
                      </div>
                  }
                    <div>
                      <h3 className="font-bold text-sm text-text-primary">
                        {inv.clientName}
                      </h3>
                      <p className="text-xs text-text-secondary font-medium">
                        {inv.number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-base text-text-primary">
                      {formatCurrency(inv.amount)}
                    </p>
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">
                      {inv.type}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full pt-3 border-t border-border/50">
                  <span className="text-xs text-text-secondary font-medium">
                    Due: {inv.dueDate}
                  </span>
                  <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusConfig.color}`}>
                  
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </div>
                </div>
              </button>);

        })
        }
        <div className="h-20" /> {/* Padding for FAB */}
      </div>

      {/* FAB */}
      <button
        onClick={onCreateNew}
        className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-teal-500 text-white rounded-2xl shadow-elevated flex items-center justify-center active:scale-90 transition-transform z-30 border border-white/20"
        aria-label="Create New">
        
        <PlusIcon className="w-7 h-7" strokeWidth={2.5} />
      </button>
    </div>);

}