import React, { cloneElement, useMemo, useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  UserPlusIcon,
  StarIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { Notification } from '../types';
import { api } from '../services/api';

const TYPE_ICONS: Record<
  string,
  {
    icon: React.ReactNode;
    bg: string;
  }> =
{
  job: {
    icon: <BriefcaseIcon className="w-5 h-5 text-blue-500" />,
    bg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  application: {
    icon: <CheckCircleIcon className="w-5 h-5 text-emerald-500" />,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30'
  },
  message: {
    icon: <MessageCircleIcon className="w-5 h-5 text-primary" />,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30'
  },
  follower: {
    icon: <UserPlusIcon className="w-5 h-5 text-purple-500" />,
    bg: 'bg-purple-100 dark:bg-purple-900/30'
  },
  review: {
    icon: <StarIcon className="w-5 h-5 text-amber-500" />,
    bg: 'bg-amber-100 dark:bg-amber-900/30'
  }
};
interface NotificationsProps {
  onBack: () => void;
}
export function Notifications({ onBack }: NotificationsProps) {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    api.notifications().then(setItems).catch(() => setItems([]));
  }, []);

  const grouped = useMemo(
    () => [{ group: 'Recent', items }],
    [items]
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">

            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-text-primary">Notifications</h1>
        </div>
        <button
          onClick={() => {
            api.markNotificationsRead().then(() =>
              setItems((prev) => prev.map((item) => ({ ...item, isRead: true })))
            );
          }}
          className="text-primary text-sm font-semibold min-h-[44px] flex items-center px-2">
          Mark all read
        </button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {grouped.map((group) =>
        <div key={group.group}>
            <div className="px-4 py-3 bg-background">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {group.group}
              </h3>
            </div>
            {group.items.map((notification) => {
            const typeConfig = TYPE_ICONS[notification.type];
            return (
              <button
                key={notification.id}
                className={`w-full text-left flex items-start gap-4 p-4 border-b border-border transition-colors min-h-[72px] ${!notification.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-surface'}`}>

                  {notification.avatar ?
                <div className="relative flex-shrink-0">
                      <UserAvatar
                    src={notification.avatar}
                    name={notification.title}
                    size="md" />

                      <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface ${typeConfig.bg}`}>

                        {cloneElement(typeConfig.icon as React.ReactElement, {
                      className: 'w-3 h-3'
                    })}
                      </div>
                    </div> :

                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${typeConfig.bg}`}>

                      {typeConfig.icon}
                    </div>
                }
                  <div className="flex-1 min-w-0">
                    <h4
                    className={`text-sm font-semibold ${!notification.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>

                      {notification.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                    <span className="text-xs text-text-secondary mt-1.5 block font-medium">
                      {notification.time}
                    </span>
                  </div>
                  {!notification.isRead &&
                <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                }
                </button>);

          })}
          </div>
        )}
      </div>
    </div>);

}