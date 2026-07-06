import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  BellIcon,
  ShieldIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LogOutIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon } from
'lucide-react';
interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate?: (pageId: string) => void;
}
export function Settings({
  onBack,
  onLogout,
  isDark,
  onToggleTheme,
  onNavigate
}: SettingsProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => setActiveToast(null), 2000);
  };
  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Toast Notification */}
      {activeToast &&
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface border border-border text-text-primary px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold animate-fade-in flex items-center gap-2">
          <span className="text-primary">✨</span> {activeToast}
        </div>
      }

      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Account Section */}
        <div>
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 ml-2">
            Account
          </h2>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            <button
              onClick={() => onNavigate?.('payment-methods')}
              className="w-full flex items-center justify-between p-4 hover:bg-background transition-colors border-b border-border">
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-sm text-text-primary">
                  Payment Methods
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={() => onNavigate?.('security')}
              className="w-full flex items-center justify-between p-4 hover:bg-background transition-colors">
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <ShieldIcon className="w-4 h-4 text-secondary" />
                </div>
                <span className="font-bold text-sm text-text-primary">
                  Security & Password
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 ml-2">
            Preferences
          </h2>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="w-full flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <BellIcon className="w-4 h-4 text-accent" />
                </div>
                <span className="font-bold text-sm text-text-primary">
                  Push Notifications
                </span>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${notificationsEnabled ? 'bg-primary' : 'bg-border'}`}>
                
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
                
              </button>
            </div>
            <div className="w-full flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
                  <ShieldIcon className="w-4 h-4 text-info" />
                </div>
                <span className="font-bold text-sm text-text-primary">
                  Location Services
                </span>
              </div>
              <button
                onClick={() => setLocationEnabled(!locationEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${locationEnabled ? 'bg-primary' : 'bg-border'}`}>
                
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${locationEnabled ? 'left-7' : 'left-1'}`} />
                
              </button>
            </div>
            <div className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center">
                  {isDark ?
                  <MoonIcon className="w-4 h-4 text-slate-500" /> :

                  <SunIcon className="w-4 h-4 text-slate-500" />
                  }
                </div>
                <span className="font-bold text-sm text-text-primary">
                  Dark Mode
                </span>
              </div>
              <button
                onClick={onToggleTheme}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-border'}`}>
                
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isDark ? 'left-7' : 'left-1'}`} />
                
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 ml-2">
            Support
          </h2>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            <button
              onClick={() => onNavigate?.('help')}
              className="w-full flex items-center justify-between p-4 hover:bg-background transition-colors border-b border-border">
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <HelpCircleIcon className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="font-bold text-sm text-text-primary">
                  Help Center
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
            </button>
            <button
              onClick={() => onNavigate?.('terms')}
              className="w-full flex items-center justify-between p-4 hover:bg-background transition-colors">
              
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-text-primary ml-11">
                  Terms of Service
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full mt-8 bg-error/10 text-error font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-error/20 transition-colors">
          
          <LogOutIcon className="w-5 h-5" />
          Log Out
        </button>

        <p className="text-center text-xs text-text-secondary mt-6 font-medium">
          SkillNet v2.4.1
        </p>
        <div className="h-6" />
      </div>
    </div>);

}