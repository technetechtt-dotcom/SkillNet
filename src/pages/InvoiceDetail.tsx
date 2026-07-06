import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  DownloadIcon,
  SendIcon,
  CheckCircleIcon,
  EditIcon,
} from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface InvoiceDetailProps {
  invoiceId: string;
  onBack: () => void;
  onEdit?: () => void;
}

export function InvoiceDetail({
  invoiceId,
  onBack,
  onEdit,
}: InvoiceDetailProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoices', invoiceId],
    queryFn: () => api.invoices.get(invoiceId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.invoices.updateStatus(invoiceId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', invoiceId] });
    },
  });

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    try {
      const blob = await api.invoices.downloadPdf(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download PDF');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading || !invoice) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const items = invoice.lineItems?.length
    ? invoice.lineItems
    : [{ description: 'Service', quantity: 1, rate: invoice.amount }];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-text-primary capitalize">
            {invoice.type} Details
          </h1>
        </div>
        {invoice.status === 'draft' && (
          <button
            onClick={onEdit}
            className="p-2 text-text-secondary hover:text-primary transition-colors rounded-full">
            <EditIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white dark:bg-surface rounded-3xl p-6 shadow-card border border-border relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-teal-500" />

          <div className="flex justify-between items-start mb-8 mt-2">
            <div>
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">
                {invoice.type}
              </h2>
              <p className="text-sm font-bold text-text-secondary mt-1">
                {invoice.number}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${invoice.status === 'paid' ? 'bg-success/10 text-success-dark dark:text-success' : invoice.status === 'sent' ? 'bg-info/10 text-info-dark dark:text-info' : invoice.status === 'overdue' ? 'bg-error/10 text-error-dark dark:text-error' : 'bg-background border border-border text-text-secondary'}`}>
              {invoice.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                From
              </p>
              <p className="font-bold text-sm text-text-primary">
                {user?.name || 'You'}
              </p>
              <p className="text-xs text-text-secondary">
                {user?.location || ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                Billed To
              </p>
              <p className="font-bold text-sm text-text-primary">
                {invoice.clientName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8 py-4 border-y border-border/50">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                Date Issued
              </p>
              <p className="font-bold text-sm text-text-primary">
                {invoice.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                Due Date
              </p>
              <p className="font-bold text-sm text-text-primary">
                {invoice.dueDate || '—'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 pb-2 border-b border-border/50">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-text-primary">
                      {item.description}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {item.quantity} x {formatCurrency(item.rate)}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-text-primary">
                    {formatCurrency(item.quantity * item.rate)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {invoice.notes && (
            <div className="mb-8 p-3 bg-background rounded-xl border border-border/50">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                Notes
              </p>
              <p className="text-sm text-text-primary">{invoice.notes}</p>
            </div>
          )}

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm font-medium text-text-secondary">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-text-secondary">
              <span>Tax (0%)</span>
              <span>R0</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/50">
              <span className="font-bold text-text-primary uppercase tracking-wider">
                Total Due
              </span>
              <span className="text-2xl font-black text-primary">
                {formatCurrency(invoice.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-surface border-t border-border flex-shrink-0 flex gap-3">
        <ActionButton
          variant="outline"
          fullWidth={false}
          className="px-4"
          aria-label="Download PDF"
          onClick={handleDownloadPdf}>
          <DownloadIcon className="w-5 h-5" />
        </ActionButton>

        {invoice.status === 'draft' ? (
          <ActionButton
            className="flex-1"
            icon={<SendIcon className="w-5 h-5" />}
            disabled={statusMutation.isPending}
            onClick={() => statusMutation.mutate('sent')}>
            Send {invoice.type}
          </ActionButton>
        ) : invoice.status === 'sent' || invoice.status === 'overdue' ? (
          <ActionButton
            className="flex-1"
            variant="gradient"
            icon={<CheckCircleIcon className="w-5 h-5" />}
            disabled={statusMutation.isPending}
            onClick={() => statusMutation.mutate('paid')}>
            Mark as Paid
          </ActionButton>
        ) : (
          <ActionButton className="flex-1" variant="secondary" disabled>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </ActionButton>
        )}
      </div>
    </div>
  );
}
