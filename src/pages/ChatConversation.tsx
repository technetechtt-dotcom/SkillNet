import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeftIcon,
  PhoneIcon,
  MoreVerticalIcon,
  SendIcon,
  CameraIcon,
  PaperclipIcon,
  VideoIcon,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserAvatar } from '../components/ui/UserAvatar';
import { MessageBubble } from '../components/ui/MessageBubble';
import { Message } from '../types';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface ChatConversationProps {
  chatId: string;
  onBack: () => void;
  onCall?: (isVideo: boolean) => void;
}

export function ChatConversation({
  chatId,
  onBack,
  onCall,
}: ChatConversationProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { data: chats = [] } = useQuery({
    queryKey: ['chats'],
    queryFn: () => api.chats.list(),
  });

  const { data: apiMessages = [], refetch } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => api.chats.messages(chatId),
  });

  const chatInfo = chats.find((c) => c.id === chatId);
  const otherUser = chatInfo?.user;

  const messages: Message[] = apiMessages.map((m) => ({
    id: m.id,
    senderId: m.senderId === user?.id ? 'me' : 'other',
    text: m.text,
    imageUrl: m.imageUrl || undefined,
    timestamp: m.timestamp,
    isRead: m.isRead,
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await api.chats.send(chatId, text);
    refetch();
    queryClient.invalidateQueries({ queryKey: ['chats'] });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {showToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface border border-border text-text-primary px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold animate-fade-in">
          File attached successfully
        </div>
      )}
      <div className="bg-surface px-2 py-3 flex items-center justify-between flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <UserAvatar
              name={otherUser?.name || 'User'}
              src={otherUser?.avatar || undefined}
              size="md"
              isOnline={otherUser?.isOnline}
            />
            <div>
              <h2 className="font-bold text-text-primary text-sm">
                {otherUser?.name || 'Chat'}
              </h2>
              <p className="text-xs text-primary font-medium">
                {otherUser?.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => onCall?.(false)}
            className="p-2 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
            <PhoneIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onCall?.(true)}
            className="p-2 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
            <VideoIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5] dark:bg-[#0B141A]">
        <div className="flex justify-center mb-6">
          <span className="bg-surface/80 backdrop-blur-sm text-text-secondary text-xs px-3 py-1 rounded-lg shadow-sm">
            Today
          </span>
        </div>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isSent={msg.senderId === 'me'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-surface p-2 border-t border-border flex items-end gap-2 flex-shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center flex-shrink-0">
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex-1 bg-background border border-border rounded-3xl flex items-end min-h-[48px] px-2 py-1">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 py-2 px-2 text-text-primary placeholder-text-secondary text-base"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="p-2 text-text-secondary hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 mb-0.5">
            <CameraIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            accept="image/*,video/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {inputText.trim() ? (
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform">
            <SendIcon className="w-5 h-5 ml-0.5" />
          </button>
        ) : (
          <button className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform">
            <PhoneIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
