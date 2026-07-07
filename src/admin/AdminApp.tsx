import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from './AdminLogin';
import { AdminGuard } from './AdminGuard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminContent } from './pages/AdminContent';
import { AdminPrograms } from './pages/AdminPrograms';
import { AdminChallenges } from './pages/AdminChallenges';
import { AdminJobs } from './pages/AdminJobs';
import { AdminData } from './pages/AdminData';
import { AdminMessages } from './pages/AdminMessages';
import { AdminFollows } from './pages/AdminFollows';

export function AdminApp() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/follows" element={<AdminFollows />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/challenges" element={<AdminChallenges />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/data" element={<AdminData />} />
        </Route>
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
