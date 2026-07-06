import React, { useState } from 'react';
import { EditIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../components/ui/SearchBar';
import { UserAvatar } from '../components/ui/UserAvatar';
import { api } from '../lib/api';

interface ChatListProps {
  onChatClick: (chatId: string) => void;
  onNewMessage?: () => void;
}

export function ChatList({ onChatClick, onNewMessage }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => api.chats.list(),
  });

  const filteredChats = chats.filter(
    (chat) =>
      chat.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 pb-4 pt-4 flex-shrink-0 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
          <button
            onClick={() => onNewMessage?.()}
            className="p-2 text-primary bg-primary/10 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center">
            <EditIcon className="w-5 h-5" />
          </button>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search messages..."
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isLoading &&
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatClick(chat.id)}
              className="w-full flex items-center gap-4 p-4 bg-surface border-b border-border active:bg-primary/5 transition-colors min-h-[72px] text-left">
              <UserAvatar
                src={chat.user?.avatar || undefined}
                name={chat.user?.name || 'User'}
                size="lg"
                isOnline={chat.user?.isOnline}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-text-primary truncate pr-2">
                    {chat.user?.name}
                  </h3>
                  <span
                    className={`text-xs flex-shrink-0 ${chat.unreadCount > 0 ? 'text-primary font-bold' : 'text-text-secondary'}`}>
                    {chat.timestamp}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {chat.unreadCount}
                  </span>
                </div>
              )}
            </button>
          ))}
        {!isLoading && filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">
              No messages found
            </h3>
            <p className="text-sm text-text-secondary font-medium">
              {searchQuery
                ? `We couldn't find any conversations matching "${searchQuery}"`
                : 'Start a conversation from a worker profile'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
