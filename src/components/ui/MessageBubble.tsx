import React from 'react';
import { CheckIcon } from 'lucide-react';
import { Message } from '../../types';
interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showAvatar?: boolean;
}
export function MessageBubble({
  message,
  isSent,
  showAvatar = false
}: MessageBubbleProps) {
  return (
    <div
      className={`flex w-full mb-4 ${isSent ? 'justify-end' : 'justify-start'}`}>
      
      <div className={`max-w-[80%] ${isSent ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl relative ${isSent ? 'bg-primary text-white rounded-br-sm' : 'bg-surface border border-border text-text-primary rounded-bl-sm'}`}>
          
          {message.imageUrl &&
          <img
            src={message.imageUrl}
            alt="Shared image"
            className="w-full rounded-xl mb-2 object-cover max-h-48" />

          }
          <p className="text-[15px] leading-relaxed break-words">
            {message.text}
          </p>

          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isSent ? 'text-primary-light' : 'text-text-secondary'}`}>
            
            <span>{message.timestamp}</span>
            {isSent &&
            <div className="flex -space-x-1">
                <CheckIcon className="w-3 h-3" />
                {message.isRead && <CheckIcon className="w-3 h-3" />}
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}