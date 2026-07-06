import React, { useState } from 'react';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserAvatar } from '../components/ui/UserAvatar';
import { api } from '../lib/api';

interface NewMessageProps {
  onBack: () => void;
  onChatClick: (chatId: string) => void;
}

export function NewMessage({ onBack, onChatClick }: NewMessageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [starting, setStarting] = useState<string | null>(null);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['users', 'search', searchQuery],
    queryFn: () => api.users.search(searchQuery || undefined),
  });

  const handleContactClick = async (userId: string) => {
    setStarting(userId);
    try {
      const { chatId } = await api.chats.start(userId);
      onChatClick(chatId);
    } catch (err) {
      console.error('Failed to start chat:', err);
    } finally {
      setStarting(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-3 flex items-center gap-3 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">New Message</h1>
      </div>

      <div className="p-4 border-b border-border bg-surface">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
            People on SkillNet
          </h2>
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="space-y-2">
            {!isLoading &&
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactClick(contact.id)}
                  disabled={starting === contact.id}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors text-left disabled:opacity-50">
                  <UserAvatar
                    src={contact.avatar || undefined}
                    name={contact.name}
                    size="md"
                  />
                  <div>
                    <h3 className="font-bold text-text-primary">{contact.name}</h3>
                    <p className="text-xs text-text-secondary">
                      {contact.skills[0]?.name || contact.location || 'SkillNet member'}
                    </p>
                  </div>
                </button>
              ))}
            {!isLoading && contacts.length === 0 && (
              <p className="text-center text-text-secondary py-8">No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
