import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('+27800000001');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(phone, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-3xl border border-border shadow-elevated p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary">Admin Login</h1>
            <p className="text-sm text-text-secondary">SkillNet management portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && (
            <p className="text-sm text-error font-medium bg-error/10 px-4 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-text-secondary text-center mt-6">
          Demo admin: +27800000001 / password123
        </p>
      </div>
    </div>
  );
}
