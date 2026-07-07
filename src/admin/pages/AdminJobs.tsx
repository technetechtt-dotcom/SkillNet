import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { api } from '../../lib/api';

function formatZar(amount: number) {
  return `R ${amount.toLocaleString('en-ZA')}`;
}

export function AdminJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['admin', 'jobs'],
    queryFn: () => api.admin.jobs.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.jobs.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-text-primary mb-1">Jobs</h1>
      <p className="text-text-secondary mb-8">Manage job listings on the marketplace</p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-text-secondary">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-border bg-background/50">
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Location</th>
                <th className="px-6 py-3 font-semibold">Pay</th>
                <th className="px-6 py-3 font-semibold">Employer</th>
                <th className="px-6 py-3 font-semibold">Posted</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-border">
                  <td className="px-6 py-3 font-medium">
                    {j.title}
                    {j.isUrgent && (
                      <span className="ml-2 text-xs text-error font-bold">URGENT</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-text-secondary">{j.location}</td>
                  <td className="px-6 py-3">{formatZar(j.paymentAmount)}</td>
                  <td className="px-6 py-3">{j.employerName || '—'}</td>
                  <td className="px-6 py-3 text-text-secondary">
                    {new Date(j.createdAt).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${j.title}"?`)) {
                          deleteMutation.mutate(j.id);
                        }
                      }}
                      className="p-2 rounded-lg text-error hover:bg-error/10">
                      <Trash2Icon className="w-4 h-4" />
                    </button>
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
