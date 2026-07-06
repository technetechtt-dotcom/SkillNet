import React, { useState } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';

export interface RegistrationDraft {
  phone: string;
  password: string;
  name: string;
  location: string;
}

interface OnboardingRegisterProps {
  onNext: (draft: RegistrationDraft) => void;
  onBack: () => void;
}

export function OnboardingRegister({
  onNext,
  onBack,
}: OnboardingRegisterProps) {
  const [countryCode, setCountryCode] = useState('+27');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const isValid =
    phone.length > 8 && password.length > 3 && name.length > 2 && location.length > 2;

  const handleContinue = () => {
    onNext({
      phone: `${countryCode}${phone.replace(/^0/, '')}`,
      password,
      name,
      location,
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-4 flex items-center flex-shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 flex justify-center pr-8">
          <div className="flex gap-2">
            <div className="w-8 h-1.5 bg-primary rounded-full" />
            <div className="w-8 h-1.5 bg-border rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-4 pb-8 flex flex-col overflow-y-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create Account
        </h1>
        <p className="text-text-secondary mb-8">
          Enter your details to join SkillNet South Africa.
        </p>

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
                <option value="+27">🇿🇦 +27</option>
                <option value="+234">🇳🇬 +234</option>
                <option value="+254">🇰🇪 +254</option>
                <option value="+233">🇬🇭 +233</option>
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="82 123 4567"
                className="flex-1 bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sipho Ndlovu"
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              City / Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Johannesburg, South Africa"
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base"
            />
          </div>
        </div>

        <div className="pt-6 flex-shrink-0">
          <ActionButton onClick={handleContinue} disabled={!isValid}>
            Continue
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
