import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareIcon } from 'lucide-react';
import { api } from '../../lib/api';

export function AdminMessages() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: () => api.admin.messages.list(),
  });

  const { data: chatDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['admin', 'messages', selectedChatId],
    queryFn: () => api.admin.messages.get(selectedChatId!),
    enabled: !!selectedChatId,
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-text-primary mb-1">Messages</h1>
      <p className="text-text-secondary mb-8">
        Monitor private conversations between users
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-1 bg-surface rounded-2xl border border-border overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border font-bold text-sm">
            Conversations ({chats.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <p className="p-4 text-text-secondary text-sm">Loading…</p>
            ) : chats.length === 0 ? (
              <p className="p-4 text-text-secondary text-sm">No conversations</p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.chatId}
                  type="button"
                  onClick={() => setSelectedChatId(chat.chatId)}
                  className={`w-full text-left p-4 border-b border-border hover:bg-background transition-colors ${
                    selectedChatId === chat.chatId ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquareIcon className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-sm font-bold truncate">
                      {chat.participants.map((p) => p.name).join(' ↔ ')}
                    </p>
                  </div>
                  {chat.lastMessage && (
                    <p className="text-xs text-text-secondary truncate pl-6">
                      <span className="font-semibold">
                        {chat.lastMessage.senderName}:
                      </span>{' '}
                      {chat.lastMessage.text}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary pl-6 mt-1">
                    {chat.messageCount} messages ·{' '}
                    {chat.lastMessage?.timeAgo || 'No messages'}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border flex flex-col overflow-hidden">
          {!selectedChatId ? (
            <div className="flex-1 flex items-center justify-center text-text-secondary">
              Select a conversation to view messages
            </div>
          ) : detailLoading ? (
            <div className="flex-1 flex items-center justify-center text-text-secondary">
              Loading messages…
            </div>
          ) : chatDetail ? (
            <>
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-bold text-text-primary">
                  {chatDetail.participants.map((p) => p.name).join(' ↔ ')}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  {chatDetail.participants.map((p) => (
                    <span
                      key={p.userId}
                      className="text-xs bg-background px-3 py-1 rounded-full text-text-secondary">
                      {p.name} · {p.phone}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {chatDetail.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      {msg.senderAvatar && (
                        <img
                          src={msg.senderAvatar}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-sm font-bold">{msg.senderName}</span>
                      <span className="text-xs text-text-secondary">
                        {msg.timeAgo}
                      </span>
                      {!msg.isRead && (
                        <span className="text-xs text-primary font-bold">unread</span>
                      )}
                    </div>
                    <p className="text-sm text-text-primary">{msg.text}</p>
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Attachment"
                        className="mt-2 max-h-40 rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
