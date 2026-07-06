import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeftIcon,
  PhoneIcon,
  MoreVerticalIcon,
  SendIcon,
  CameraIcon,
  PaperclipIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { MessageBubble } from '../components/ui/MessageBubble';
import { Message } from '../types';
import { api } from '../services/api';
interface ChatConversationProps {
  chatId: string;
  onBack: () => void;
}
export function ChatConversation({ chatId, onBack }: ChatConversationProps) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    api.chatMessages(chatId).then(setMessages).catch(() => setMessages([]));
  }, [chatId]);
  const handleSend = () => {
    if (!inputText.trim()) return;
    api.sendMessage(chatId, inputText)
      .then((newMessage) => setMessages((prev) => [...prev, newMessage]))
      .catch(() => undefined);
    setInputText('');
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-2 py-3 flex items-center justify-between flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">

            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <UserAvatar
              name="TechHub Ltd"
              src="https://i.pravatar.cc/150?u=techhub"
              size="md"
              isOnline />

            <div>
              <h2 className="font-bold text-text-primary text-sm">
                TechHub Ltd
              </h2>
              <p className="text-xs text-primary font-medium">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button className="p-2 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
            <PhoneIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#E5DDD5] dark:bg-[#0B141A]">
        <div className="flex justify-center mb-6">
          <span className="bg-surface/80 backdrop-blur-sm text-text-secondary text-xs px-3 py-1 rounded-lg shadow-sm">
            Today
          </span>
        </div>
        {messages.map((msg) =>
        <MessageBubble
          key={msg.id}
          message={msg}
          isSent={msg.senderId === 'me'} />

        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area — in flow, not fixed */}
      <div className="bg-surface p-2 border-t border-border flex items-end gap-2 flex-shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button className="p-3 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center flex-shrink-0">
          <PaperclipIcon className="w-6 h-6" />
        </button>

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
            }} />

          <button className="p-2 text-text-secondary hover:text-primary min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 mb-0.5">
            <CameraIcon className="w-6 h-6" />
          </button>
        </div>

        {inputText.trim() ?
        <button
          onClick={handleSend}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform">

            <SendIcon className="w-5 h-5 ml-0.5" />
          </button> :

        <button className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-transform">
            <PhoneIcon className="w-5 h-5" />
          </button>
        }
      </div>
    </div>);

}