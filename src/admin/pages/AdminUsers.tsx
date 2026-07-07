import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, Trash2Icon, SearchIcon, EyeIcon, BanIcon, UsersIcon } from 'lucide-react';
import { api, AdminUser } from '../../lib/api';
import { UserContentPanel } from '../components/UserContentPanel';
import { BlockUserModal } from '../components/BlockUserModal';
import { UserFollowPanel } from '../components/UserFollowPanel';

export function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [contentUser, setContentUser] = useState<AdminUser | null>(null);
  const [blockUser, setBlockUser] = useState<AdminUser | null>(null);
  const [followUser, setFollowUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '+27',
    password: '',
    role: 'user',
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users', search, roleFilter],
    queryFn: () =>
      api.admin.users.list({
        q: search || undefined,
        role: roleFilter || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.admin.users.update(id, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.users.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  const createMutation = useMutation({
    mutationFn: () => api.admin.users.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setShowCreate(false);
      setForm({ name: '', phone: '+27', password: '', role: 'user' });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Users</h1>
          <p className="text-text-secondary">Manage platform accounts and roles</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">
          <PlusIcon className="w-4 h-4" />
          Add user
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm">
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {showCreate && (
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold text-text-primary">New user</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Phone (+27…)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">
              Create
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-xl border border-border text-sm font-semibold">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-text-secondary">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-border bg-background/50">
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Followers</th>
                <th className="px-6 py-3 font-semibold">Following</th>
                <th className="px-6 py-3 font-semibold">Trust</th>
                <th className="px-6 py-3 font-semibold">Rating</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: AdminUser) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium">{u.name}</td>
                  <td className="px-6 py-3 text-text-secondary">{u.phone}</td>
                  <td className="px-6 py-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateMutation.mutate({ id: u.id, role: e.target.value })
                      }
                      className="px-2 py-1 rounded-lg border border-border bg-background text-xs font-bold">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        u.accountStatus === 'blocked'
                          ? 'bg-error/10 text-error'
                          : 'bg-success/10 text-success'
                      }`}>
                      {u.accountStatus || 'active'}
                      {u.blockedUntil &&
                        u.accountStatus === 'blocked' &&
                        ` until ${new Date(u.blockedUntil).toLocaleDateString('en-ZA')}`}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold text-primary">
                    {u.followerCount ?? 0}
                  </td>
                  <td className="px-6 py-3 font-semibold text-text-secondary">
                    {u.followingCount ?? 0}
                  </td>
                  <td className="px-6 py-3">{u.trustScore}</td>
                  <td className="px-6 py-3">{u.rating.toFixed(1)}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setContentUser(u)}
                        title="View content"
                        className="p-2 rounded-lg text-primary hover:bg-primary/10">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setFollowUser(u)}
                        title="View followers & following"
                        className="p-2 rounded-lg text-secondary hover:bg-secondary/10">
                        <UsersIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setBlockUser(u)}
                        title={u.accountStatus === 'blocked' ? 'Unblock user' : 'Block user'}
                        className={`p-2 rounded-lg ${
                          u.accountStatus === 'blocked'
                            ? 'text-warning hover:bg-warning/10'
                            : 'text-error hover:bg-error/10'
                        }`}>
                        <BanIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${u.name}?`)) {
                            deleteMutation.mutate(u.id);
                          }
                        }}
                        className="p-2 rounded-lg text-error hover:bg-error/10">
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserContentPanel
        user={contentUser}
        onClose={() => setContentUser(null)}
      />
      <UserFollowPanel user={followUser} onClose={() => setFollowUser(null)} />
      <BlockUserModal user={blockUser} onClose={() => setBlockUser(null)} />
    </div>
  );
}
