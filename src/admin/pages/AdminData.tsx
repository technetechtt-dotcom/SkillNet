import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

function formatZar(amount: number) {
  return `R ${amount.toLocaleString('en-ZA')}`;
}

export function AdminData() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: () => api.admin.transactions.list(),
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-text-primary mb-1">Data</h1>
      <p className="text-text-secondary mb-8">
        Wallet transactions and platform financial activity
      </p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-text-secondary">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-border bg-background/50">
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Description</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border">
                  <td className="px-6 py-3 font-medium">
                    {tx.userName || 'Unknown'}
                  </td>
                  <td className="px-6 py-3 capitalize">{tx.type}</td>
                  <td
                    className={`px-6 py-3 font-semibold ${
                      tx.type === 'received' ? 'text-success' : 'text-text-primary'
                    }`}>
                    {formatZar(tx.amount)}
                  </td>
                  <td className="px-6 py-3 text-text-secondary max-w-xs truncate">
                    {tx.description || '—'}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-background">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-text-secondary">
                    {new Date(tx.createdAt).toLocaleString('en-ZA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
