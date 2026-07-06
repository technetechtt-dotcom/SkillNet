import React, { useState } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { ApiError } from '../lib/api';

interface SignInProps {
  onBack: () => void;
  onSignIn: () => void;
  onCreateAccount: () => void;
  onLogin: (phone: string, password: string) => Promise<void>;
}

export function SignIn({
  onBack,
  onSignIn,
  onCreateAccount,
  onLogin,
}: SignInProps) {
  const [countryCode, setCountryCode] = useState('+234');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isValid = phone.length > 8 && password.length > 3;

  const handleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const fullPhone = `${countryCode}${phone.replace(/^0/, '')}`;
      await onLogin(fullPhone, password);
      onSignIn();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 flex items-center flex-shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-4 pb-8 flex flex-col overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-text-secondary">
            Sign in to your SkillNet account.
          </p>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-primary text-base min-w-[100px]">
                <option value="+234">🇳🇬 +234</option>
                <option value="+254">🇰🇪 +254</option>
                <option value="+27">🇿🇦 +27</option>
                <option value="+233">🇬🇭 +233</option>
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="080 123 4567"
                className="flex-1 bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base" />
              
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <button className="text-sm font-semibold text-primary min-h-[44px] flex items-center">
                Forgot?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base" />
            
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <div className="pt-6 flex-shrink-0">
          <ActionButton
            onClick={handleSignIn}
            disabled={!isValid}
            loading={isLoading}>
            
            Sign In
          </ActionButton>
          <p className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{' '}
            <button
              onClick={onCreateAccount}
              className="text-primary font-semibold p-2 min-h-[44px]">
              
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>);

}