import React, { cloneElement } from 'react';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  UserPlusIcon,
  StarIcon } from
'lucide-react';
import { Notification } from '../../types';
import { UserAvatar } from './UserAvatar';
interface NotificationCardProps {
  notification: Notification;
  onPress: () => void;
}
export function NotificationCard({
  notification,
  onPress
}: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'job':
        return <BriefcaseIcon className="w-5 h-5 text-blue-500" />;
      case 'application':
        return <CheckCircleIcon className="w-5 h-5 text-success" />;
      case 'message':
        return <MessageCircleIcon className="w-5 h-5 text-primary" />;
      case 'follower':
        return <UserPlusIcon className="w-5 h-5 text-purple-500" />;
      case 'review':
        return <StarIcon className="w-5 h-5 text-secondary" />;
      default:
        return <BriefcaseIcon className="w-5 h-5 text-text-secondary" />;
    }
  };
  const getBgColor = () => {
    switch (notification.type) {
      case 'job':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'application':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'message':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'follower':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'review':
        return 'bg-amber-100 dark:bg-amber-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };
  return (
    <button
      onClick={onPress}
      className={`w-full text-left flex items-start gap-4 p-4 mb-2 rounded-2xl transition-colors touch-target
        ${!notification.isRead ? 'bg-primary/5 border-l-4 border-primary' : 'bg-surface border border-border hover:bg-surface/80'}
      `}>
      
      <div className="relative flex-shrink-0">
        {notification.avatar ?
        <UserAvatar
          src={notification.avatar}
          name={notification.title}
          size="md" /> :


        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${getBgColor()}`}>
          
            {getIcon()}
          </div>
        }
        {notification.avatar &&
        <div
          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface ${getBgColor()}`}>
          
            {cloneElement(getIcon() as React.ReactElement, {
            className: 'w-3 h-3'
          })}
          </div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>
          
          {notification.title}
        </h4>
        <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">
          {notification.description}
        </p>
        <span className="text-xs text-text-secondary mt-2 block font-medium">
          {notification.time}
        </span>
      </div>

      {!notification.isRead &&
      <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
      }
    </button>);

}