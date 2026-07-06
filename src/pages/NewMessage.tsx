import React, { useState } from 'react';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
interface NewMessageProps {
  onBack: () => void;
  onChatClick: (chatId: string) => void;
}
const MOCK_CONTACTS = [
{
  id: 'c1',
  name: 'David Omondi',
  role: 'Electrician',
  avatar: 'https://i.pravatar.cc/150?u=david'
},
{
  id: 'c2',
  name: 'Sarah Jenkins',
  role: 'Plumber',
  avatar: 'https://i.pravatar.cc/150?u=sarah'
},
{
  id: 'c3',
  name: 'Michael Chen',
  role: 'Carpenter',
  avatar: 'https://i.pravatar.cc/150?u=michael'
},
{
  id: 'c4',
  name: 'Grace Wanjiku',
  role: 'Client',
  avatar: 'https://i.pravatar.cc/150?u=grace'
}];

export function NewMessage({ onBack, onChatClick }: NewMessageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredContacts = MOCK_CONTACTS.filter(
    (contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
            placeholder="Search contacts..."
            className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary outline-none focus:border-primary transition-colors" />
          
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
            Suggested Contacts
          </h2>
          <div className="space-y-2">
            {filteredContacts.map((contact) =>
            <button
              key={contact.id}
              onClick={() => onChatClick(contact.id)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors text-left">
              
                <UserAvatar
                src={contact.avatar}
                name={contact.name}
                size="md" />
              
                <div>
                  <h3 className="font-bold text-text-primary">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-text-secondary">{contact.role}</p>
                </div>
              </button>
            )}
            {filteredContacts.length === 0 &&
            <p className="text-center text-text-secondary py-8">
                No contacts found
              </p>
            }
          </div>
        </div>
      </div>
    </div>);

}