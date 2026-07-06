import React, { useState, cloneElement } from 'react';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  UserPlusIcon,
  StarIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
interface NotificationItem {
  id: string;
  type: 'job' | 'application' | 'message' | 'follower' | 'review';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  avatar?: string;
}
const MOCK_NOTIFICATIONS: {
  group: string;
  items: NotificationItem[];
}[] = [
{
  group: 'Today',
  items: [
  {
    id: 'n1',
    type: 'job',
    title: 'New job near you',
    description:
    'Plumbing repair needed in Victoria Island, Lagos — ₦45,000',
    time: '10 mins ago',
    isRead: false
  },
  {
    id: 'n2',
    type: 'application',
    title: 'Application accepted!',
    description:
    'TechHub Ltd accepted your application for plumbing repair.',
    time: '1 hour ago',
    isRead: false,
    avatar: 'https://i.pravatar.cc/150?u=techhub'
  },
  {
    id: 'n3',
    type: 'follower',
    title: 'New follower',
    description: 'Fatima Hassan started following you.',
    time: '3 hours ago',
    isRead: false,
    avatar: 'https://i.pravatar.cc/150?u=fatima'
  }]

},
{
  group: 'This Week',
  items: [
  {
    id: 'n4',
    type: 'review',
    title: 'New 5-star review',
    description:
    'Grace Wanjiku left a review: "Great work on the engine repair!"',
    time: '2 days ago',
    isRead: true,
    avatar: 'https://i.pravatar.cc/150?u=grace'
  },
  {
    id: 'n5',
    type: 'message',
    title: 'New message',
    description: 'David Omondi sent you a message about a job.',
    time: '3 days ago',
    isRead: true
  },
  {
    id: 'n6',
    type: 'job',
    title: 'Trending job',
    description:
    'Mechanic needed for fleet maintenance in Accra — GH₵ 800/day',
    time: '4 days ago',
    isRead: true
  }]

},
{
  group: 'Earlier',
  items: [
  {
    id: 'n7',
    type: 'follower',
    title: 'New follower',
    description: 'Kofi Asante started following you.',
    time: '1 week ago',
    isRead: true,
    avatar: 'https://i.pravatar.cc/150?u=kofi'
  },
  {
    id: 'n8',
    type: 'application',
    title: 'Application viewed',
    description: 'Speedy Delivery viewed your application.',
    time: '2 weeks ago',
    isRead: true
  }]

}];

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
  onJobClick: (jobId: string) => void;
  onChatClick: (chatId: string) => void;
  onWorkerClick: (workerId: string) => void;
}
export function Notifications({
  onBack,
  onJobClick,
  onChatClick,
  onWorkerClick
}: NotificationsProps) {
  const [readAll, setReadAll] = useState(false);
  const [localRead, setLocalRead] = useState<string[]>([]);
  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead && !readAll) {
      setLocalRead((prev) => [...prev, notification.id]);
    }
    switch (notification.type) {
      case 'job':
      case 'application':
        onJobClick('j1');
        break;
      case 'message':
        onChatClick('c2');
        break;
      case 'follower':
        onWorkerClick('w1');
        break;
      case 'review':
        // Just mark as read
        break;
    }
  };
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
          onClick={() => setReadAll(true)}
          className="text-primary text-sm font-semibold min-h-[44px] flex items-center px-2">
          
          Mark all read
        </button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((group) =>
        <div key={group.group}>
            <div className="px-4 py-3 bg-background">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {group.group}
              </h3>
            </div>
            {group.items.map((notification) => {
            const typeConfig = TYPE_ICONS[notification.type];
            const isActuallyRead =
            notification.isRead ||
            readAll ||
            localRead.includes(notification.id);
            return (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left flex items-start gap-4 p-4 border-b border-border transition-colors min-h-[72px] ${!isActuallyRead ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-surface'}`}>
                
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
                    className={`text-sm font-semibold ${!isActuallyRead ? 'text-text-primary' : 'text-text-secondary'}`}>
                    
                      {notification.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                    <span className="text-xs text-text-secondary mt-1.5 block font-medium">
                      {notification.time}
                    </span>
                  </div>
                  {!isActuallyRead &&
                <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                }
                </button>);

          })}
          </div>
        )}
      </div>
    </div>);

}