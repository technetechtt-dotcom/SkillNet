import React, { useEffect, useState } from 'react';
import { EditIcon } from 'lucide-react';
import { SearchBar } from '../components/ui/SearchBar';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ChatSummary } from '../types';
import { api } from '../services/api';

interface ChatListProps {
  onChatClick: (chatId: string) => void;
}
export function ChatList({ onChatClick }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<ChatSummary[]>([]);

  useEffect(() => {
    api.chats().then(setChats).catch(() => setChats([]));
  }, []);

  const filtered = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 pb-4 pt-4 flex-shrink-0 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
          <button className="p-2 text-primary bg-primary/10 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center">
            <EditIcon className="w-5 h-5" />
          </button>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search messages..." />

      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat) =>
        <button
          key={chat.id}
          onClick={() => onChatClick(chat.id)}
          className="w-full flex items-center gap-4 p-4 bg-surface border-b border-border active:bg-primary/5 transition-colors min-h-[72px] text-left">

            <UserAvatar
            src={chat.user.avatar}
            name={chat.user.name}
            size="lg"
            isOnline={chat.user.isOnline} />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-text-primary truncate pr-2">
                  {chat.user.name}
                </h3>
                <span
                className={`text-xs flex-shrink-0 ${chat.unread > 0 ? 'text-primary font-bold' : 'text-text-secondary'}`}>

                  {chat.time}
                </span>
              </div>
              <p
              className={`text-sm truncate ${chat.unread > 0 ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}>

                {chat.lastMessage}
              </p>
            </div>
            {chat.unread > 0 &&
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {chat.unread}
                </span>
              </div>
          }
          </button>
        )}
      </div>
    </div>);

}