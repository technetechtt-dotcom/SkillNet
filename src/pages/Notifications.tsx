import React from 'react';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  UserPlusIcon,
  StarIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserAvatar } from '../components/ui/UserAvatar';
import { api } from '../lib/api';

interface NotificationsProps {
  onBack: () => void;
  onJobClick?: (jobId: string) => void;
  onChatClick?: (chatId: string) => void;
  onWorkerClick?: (workerId: string) => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  job: <BriefcaseIcon className="w-5 h-5" />,
  application: <CheckCircleIcon className="w-5 h-5" />,
  message: <MessageCircleIcon className="w-5 h-5" />,
  follower: <UserPlusIcon className="w-5 h-5" />,
  review: <StarIcon className="w-5 h-5" />,
};

export function Notifications({
  onBack,
  onJobClick,
  onChatClick,
}: NotificationsProps) {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.notifications.list(),
  });

  const handleClick = (item: (typeof notifications)[0]) => {
    if (item.type === 'job' && item.metadata?.jobId) {
      onJobClick?.(item.metadata.jobId);
    } else if (item.type === 'message' && item.metadata?.chatId) {
      onChatClick?.(item.metadata.chatId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Notifications</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <span className="text-4xl mb-4">🔔</span>
            <h3 className="text-lg font-bold text-text-primary mb-1">
              No notifications yet
            </h3>
            <p className="text-sm text-text-secondary">
              Job updates and messages will appear here
            </p>
          </div>
        )}
        {!isLoading &&
          notifications.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`w-full flex items-start gap-4 p-4 border-b border-border text-left transition-colors ${
                !item.isRead ? 'bg-primary/5' : 'bg-surface'
              }`}>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  !item.isRead
                    ? 'bg-primary/10 text-primary'
                    : 'bg-background text-text-secondary'
                }`}>
                {TYPE_ICONS[item.type] || TYPE_ICONS.job}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className={`text-sm ${!item.isRead ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                    {item.title}
                  </h3>
                  <span className="text-xs text-text-secondary flex-shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
              {!item.isRead && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </button>
          ))}
      </div>
    </div>
  );
}
