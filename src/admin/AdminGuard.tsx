import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminGuard() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-black text-text-primary mb-2">
            Access denied
          </h1>
          <p className="text-text-secondary mb-6">
            Your account does not have admin privileges.
          </p>
          <a
            href="/app"
            className="inline-block px-6 py-3 rounded-xl bg-primary text-white font-bold">
            Go to app
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
