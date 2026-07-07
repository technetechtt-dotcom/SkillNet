import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { UsersIcon, XIcon } from 'lucide-react';
import { api, AdminUser } from '../../lib/api';

interface UserFollowPanelProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function UserFollowPanel({ user, onClose }: UserFollowPanelProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'user-social', user?.id],
    queryFn: () => api.admin.users.social(user!.id),
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/40"
      onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-surface border-l border-border shadow-elevated overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-text-primary">{user.name}</h2>
            <p className="text-sm text-text-secondary">
              {data?.followerCount ?? user.followerCount ?? 0} followers ·{' '}
              {data?.followingCount ?? user.followingCount ?? 0} following
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-background">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Link
            to="/admin/follows"
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <UsersIcon className="w-4 h-4" />
            View all follow relationships
          </Link>

          {isLoading ? (
            <p className="text-text-secondary text-sm">Loading…</p>
          ) : (
            <>
              <section>
                <h3 className="font-bold text-text-primary mb-3">
                  Followers ({data?.followers.length ?? 0})
                </h3>
                {!data?.followers.length ? (
                  <p className="text-sm text-text-secondary">No followers yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.followers.map((f) => (
                      <div
                        key={f.userId}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border">
                        {f.avatar ? (
                          <img
                            src={f.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{f.name}</p>
                          <p className="text-xs text-text-secondary">{f.phone}</p>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {new Date(f.createdAt).toLocaleDateString('en-ZA')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="font-bold text-text-primary mb-3">
                  Following ({data?.following.length ?? 0})
                </h3>
                {!data?.following.length ? (
                  <p className="text-sm text-text-secondary">Not following anyone</p>
                ) : (
                  <div className="space-y-2">
                    {data.following.map((f) => (
                      <div
                        key={f.userId}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border">
                        {f.avatar ? (
                          <img
                            src={f.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{f.name}</p>
                          <p className="text-xs text-text-secondary">{f.phone}</p>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {new Date(f.createdAt).toLocaleDateString('en-ZA')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
