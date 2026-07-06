import React from 'react';
import {
  HomeIcon,
  BriefcaseIcon,
  MessageCircleIcon,
  UserIcon,
  WalletIcon } from
'lucide-react';
export type TabType = 'home' | 'jobs' | 'wallet' | 'messages' | 'profile';
interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadMessages?: number;
}
export function BottomNav({
  activeTab,
  onTabChange,
  unreadMessages = 0
}: BottomNavProps) {
  const tabs = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: BriefcaseIcon
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: WalletIcon
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircleIcon,
    badge: unreadMessages
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon
  }] as
  const;
  return (
    <div className="bg-surface border-t border-border flex-shrink-0 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] pt-1"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}>

              {/* Active Indicator Pill */}
              <div
                className={`absolute top-0 w-1 h-1 rounded-full transition-all duration-300 ${isActive ? 'bg-primary scale-100' : 'bg-transparent scale-0'}`} />


              <div
                className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-primary'}`}>

                <Icon
                  className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
                  strokeWidth={isActive ? 2.5 : 2} />

                {'badge' in tab && tab.badge ?
                <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span> :
                null}
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold transition-colors duration-200 ${isActive ? 'text-primary' : 'text-text-secondary'}`}>

                {tab.label}
              </span>
            </button>);

        })}
      </div>
    </div>);

}