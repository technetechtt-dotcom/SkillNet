import React from 'react';
import {
  LayoutDashboardIcon,
  UsersIcon,
  FilmIcon,
  GraduationCapIcon,
  TrophyIcon,
  BriefcaseIcon,
  DatabaseIcon,
  LogOutIcon,
  ExternalLinkIcon,
  MessageSquareIcon,
  UserPlusIcon,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboardIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/follows', label: 'Follows', icon: UserPlusIcon },
  { to: '/admin/content', label: 'Content', icon: FilmIcon },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquareIcon },
  { to: '/admin/programs', label: 'Programs', icon: GraduationCapIcon },
  { to: '/admin/challenges', label: 'Challenges', icon: TrophyIcon },
  { to: '/admin/jobs', label: 'Jobs', icon: BriefcaseIcon },
  { to: '/admin/data', label: 'Data', icon: DatabaseIcon },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-surface border-r border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-black text-primary">SkillNet</h1>
          <p className="text-xs text-text-secondary font-medium mt-1">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`
              }>
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <a
            href="/app"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            <ExternalLinkIcon className="w-4 h-4" />
            Open mobile app
          </a>
          <div className="px-4 py-2">
            <p className="text-sm font-semibold text-text-primary truncate">
              {user?.name}
            </p>
            <p className="text-xs text-text-secondary">{user?.phone}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-error hover:bg-error/10 transition-colors">
            <LogOutIcon className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
