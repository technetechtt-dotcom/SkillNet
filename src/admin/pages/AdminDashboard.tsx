import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UsersIcon,
  BriefcaseIcon,
  FilmIcon,
  TrophyIcon,
  GraduationCapIcon,
  WalletIcon,
} from 'lucide-react';
import { api } from '../../lib/api';

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-3xl font-black text-text-primary mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function formatZar(amount: number) {
  return `R ${amount.toLocaleString('en-ZA')}`;
}

export function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.admin.stats(),
  });

  if (isLoading) {
    return <p className="text-text-secondary">Loading dashboard…</p>;
  }

  const c = data?.counts;

  return (
    <div>
      <h1 className="text-2xl font-black text-text-primary mb-1">Dashboard</h1>
      <p className="text-text-secondary mb-8">
        Platform overview and recent activity
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total users"
          value={c?.users ?? 0}
          icon={UsersIcon}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="Active jobs"
          value={c?.jobs ?? 0}
          icon={BriefcaseIcon}
          color="bg-secondary/10 text-secondary"
        />
        <StatCard
          label="Videos"
          value={c?.videos ?? 0}
          icon={FilmIcon}
          color="bg-accent/10 text-accent"
        />
        <StatCard
          label="Stories"
          value={c?.stories ?? 0}
          icon={FilmIcon}
          color="bg-info/10 text-info"
        />
        <StatCard
          label="Challenges"
          value={c?.challenges ?? 0}
          icon={TrophyIcon}
          color="bg-warning/10 text-warning"
        />
        <StatCard
          label="Programs"
          value={c?.programs ?? 0}
          icon={GraduationCapIcon}
          color="bg-success/10 text-success"
        />
        <StatCard
          label="Transactions"
          value={c?.transactions ?? 0}
          icon={WalletIcon}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="Total wallet balance"
          value={formatZar(c?.walletBalance ?? 0)}
          icon={WalletIcon}
          color="bg-success/10 text-success"
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-text-primary">Recent sign-ups</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-secondary border-b border-border">
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Phone</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {data?.recentUsers.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium text-text-primary">
                  {u.name}
                </td>
                <td className="px-6 py-3 text-text-secondary">{u.phone}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-background text-text-secondary'
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-text-secondary">
                  {new Date(u.createdAt).toLocaleDateString('en-ZA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
