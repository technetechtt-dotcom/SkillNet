import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon, UserPlusIcon } from 'lucide-react';
import { api } from '../../lib/api';

export function AdminFollows() {
  const [search, setSearch] = useState('');

  const { data: follows = [], isLoading } = useQuery({
    queryKey: ['admin', 'follows', search],
    queryFn: () => api.admin.follows.list(search || undefined),
  });

  const uniqueUsers = new Set<string>();
  for (const f of follows) {
    uniqueUsers.add(f.followerId);
    uniqueUsers.add(f.followingId);
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-text-primary mb-1">Follow Network</h1>
      <p className="text-text-secondary mb-6">
        See who follows who across the platform
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface rounded-2xl border border-border p-5">
          <p className="text-sm text-text-secondary">Total connections</p>
          <p className="text-3xl font-black text-primary">{follows.length}</p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5">
          <p className="text-sm text-text-secondary">Users in network</p>
          <p className="text-3xl font-black text-text-primary">{uniqueUsers.size}</p>
        </div>
        <div className="bg-surface rounded-2xl border border-border p-5">
          <p className="text-sm text-text-secondary">Avg followers</p>
          <p className="text-3xl font-black text-text-primary">
            {uniqueUsers.size
              ? (follows.length / uniqueUsers.size).toFixed(1)
              : '0'}
          </p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm"
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-text-secondary">Loading follow relationships…</p>
        ) : follows.length === 0 ? (
          <p className="p-6 text-text-secondary">No follow relationships found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-border bg-background/50">
                <th className="px-6 py-3 font-semibold">Follower</th>
                <th className="px-6 py-3 font-semibold"></th>
                <th className="px-6 py-3 font-semibold">Following</th>
                <th className="px-6 py-3 font-semibold">Since</th>
              </tr>
            </thead>
            <tbody>
              {follows.map((f, i) => (
                <tr key={`${f.followerId}-${f.followingId}-${i}`} className="border-b border-border">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {f.followerAvatar ? (
                        <img
                          src={f.followerAvatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                      )}
                      <div>
                        <p className="font-semibold text-text-primary">
                          {f.followerName}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {f.followerPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-text-secondary">
                    <UserPlusIcon className="w-4 h-4 text-primary" />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {f.followingAvatar ? (
                        <img
                          src={f.followingAvatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary/20" />
                      )}
                      <div>
                        <p className="font-semibold text-text-primary">
                          {f.followingName}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {f.followingPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-text-secondary">
                    {new Date(f.createdAt).toLocaleDateString('en-ZA')}
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
