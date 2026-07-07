import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BanIcon, ShieldOffIcon } from 'lucide-react';
import { api, AdminUser } from '../../lib/api';

const DURATIONS = [
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: 'permanent', label: 'Permanent' },
];

interface BlockUserModalProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function BlockUserModal({ user, onClose }: BlockUserModalProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('Violated platform community guidelines');
  const [duration, setDuration] = useState('7d');
  const [customUntil, setCustomUntil] = useState('');

  const blockMutation = useMutation({
    mutationFn: () =>
      api.admin.moderation.blockUser(user!.id, {
        reason,
        duration: customUntil ? undefined : duration,
        blockedUntil: customUntil || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      onClose();
    },
  });

  const unblockMutation = useMutation({
    mutationFn: () => api.admin.moderation.unblockUser(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      onClose();
    },
  });

  if (!user) return null;

  const isBlocked = user.accountStatus === 'blocked';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}>
      <div
        className="bg-surface rounded-2xl border border-border shadow-elevated w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-black text-text-primary mb-1">
          {isBlocked ? 'Unblock user' : 'Block user'}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {user.name} · {user.phone}
        </p>

        {isBlocked ? (
          <div className="space-y-4">
            {user.blockReason && (
              <p className="text-sm bg-error/10 text-error px-4 py-3 rounded-xl">
                Reason: {user.blockReason}
              </p>
            )}
            {user.blockedUntil && (
              <p className="text-sm text-text-secondary">
                Until:{' '}
                {new Date(user.blockedUntil).toLocaleString('en-ZA')}
              </p>
            )}
            {!user.blockedUntil && (
              <p className="text-sm text-text-secondary">Permanent block</p>
            )}
            <button
              onClick={() => unblockMutation.mutate()}
              disabled={unblockMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold">
              <ShieldOffIcon className="w-4 h-4" />
              Unblock account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Block duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm mb-2">
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={customUntil}
                onChange={(e) => setCustomUntil(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
                placeholder="Or set custom end date"
              />
              <p className="text-xs text-text-secondary mt-1">
                Custom date overrides duration preset
              </p>
            </div>
            <button
              onClick={() => blockMutation.mutate()}
              disabled={blockMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-error text-white font-bold">
              <BanIcon className="w-4 h-4" />
              Block account
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-sm font-semibold text-text-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
