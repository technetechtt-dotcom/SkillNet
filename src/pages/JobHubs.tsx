import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  FilterIcon,
  MessageCircleIcon,
  MapPinIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { FilterChip } from '../components/ui/FilterChip';
interface JobHubsProps {
  onBack: () => void;
  onWorkerClick: (workerId: string) => void;
  onChatClick?: (workerId: string) => void;
}
const NEARBY_WORKERS = [
{
  id: 'w1',
  name: 'Kwame Mensah',
  skill: 'Mechanic',
  distance: '0.8km away',
  rating: 4.8,
  status: 'available',
  avatar: 'https://i.pravatar.cc/150?u=kwame',
  pos: {
    top: '30%',
    left: '40%'
  }
},
{
  id: 'w2',
  name: 'Amara Okafor',
  skill: 'Electrician',
  distance: '1.2km away',
  rating: 4.9,
  status: 'busy',
  avatar: 'https://i.pravatar.cc/150?u=amara',
  pos: {
    top: '60%',
    left: '20%'
  }
},
{
  id: 'w3',
  name: 'Thabo Molefe',
  skill: 'Carpenter',
  distance: '2.5km away',
  rating: 4.7,
  status: 'available',
  avatar: 'https://i.pravatar.cc/150?u=thabo',
  pos: {
    top: '20%',
    left: '70%'
  }
},
{
  id: 'w4',
  name: 'Zainab Mwangi',
  skill: 'Plumber',
  distance: '3.1km away',
  rating: 4.8,
  status: 'available',
  avatar: 'https://i.pravatar.cc/150?u=zainab',
  pos: {
    top: '75%',
    left: '65%'
  }
},
{
  id: 'w5',
  name: 'Kofi Asante',
  skill: 'Driver',
  distance: '4.0km away',
  rating: 4.6,
  status: 'busy',
  avatar: 'https://i.pravatar.cc/150?u=kofi',
  pos: {
    top: '45%',
    left: '85%'
  }
}];

const FILTERS = [
'All',
'Electrician',
'Plumber',
'Mechanic',
'Carpenter',
'Driver'];

export function JobHubs({ onBack, onWorkerClick, onChatClick }: JobHubsProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };
  const filteredWorkers =
  activeFilter === 'All' ?
  NEARBY_WORKERS :
  NEARBY_WORKERS.filter((w) => w.skill === activeFilter);
  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-surface/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-text-primary">
            Nearby Workers
          </h1>
        </div>
        <button className="p-2 bg-surface rounded-full shadow-sm border border-border">
          <FilterIcon className="w-5 h-5 text-text-primary" />
        </button>
      </div>

      {/* Simulated Map Area */}
      <div className="relative h-[55%] w-full bg-gradient-to-br from-teal-50 via-slate-100 to-orange-50 dark:from-teal-950 dark:via-slate-900 dark:to-orange-950 overflow-hidden">
        {/* Map grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
            'linear-gradient(#0D9488 1px, transparent 1px), linear-gradient(90deg, #0D9488 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        

        {/* Radius circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-dashed border-primary/40 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-2 border-dashed border-primary/20 bg-primary/5" />

        {/* Center "You" marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 bg-info rounded-full border-2 border-white shadow-lg relative z-10" />
          <div className="absolute w-12 h-12 bg-info/30 rounded-full animate-ping" />
          <span className="mt-1 bg-surface/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-text-primary shadow-sm">
            You
          </span>
        </div>

        {/* Worker Pins */}
        {filteredWorkers.map((worker) =>
        <div
          key={worker.id}
          className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10"
          style={{
            top: worker.pos.top,
            left: worker.pos.left
          }}
          onClick={() => onWorkerClick(worker.id)}>
          
            <div className="relative">
              <UserAvatar
              src={worker.avatar}
              name={worker.name}
              size="sm"
              className="shadow-md border-2 border-surface" />
            
              <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-surface ${worker.status === 'available' ? 'bg-success' : 'bg-warning'}`} />
            
            </div>
            <div className="mt-1 bg-surface/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm border border-border">
              <span className="text-[10px] font-bold text-text-primary">
                {worker.skill}
              </span>
              <span className="text-[9px] text-text-secondary font-medium">
                ★{worker.rating}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-surface rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col z-20 border-t border-border">
        {/* Drag handle */}
        <div className="w-full flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-12 h-1.5 bg-border rounded-full" />
        </div>

        <div className="px-4 pb-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-primary" /> Available Now —
            Within 5km
          </h2>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-3 pb-1">
            {FILTERS.map((filter) =>
            <FilterChip
              key={filter}
              label={filter}
              selected={activeFilter === filter}
              onToggle={() => setActiveFilter(filter)} />

            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
          {filteredWorkers.map((worker) =>
          <div
            key={worker.id}
            onClick={() => onWorkerClick(worker.id)}
            className="bg-background rounded-2xl p-3 border border-border flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer">
            
              <div className="relative flex-shrink-0">
                <UserAvatar src={worker.avatar} name={worker.name} size="md" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-bold text-sm text-text-primary truncate">
                    {worker.name}
                  </h3>
                  <span className="text-xs font-bold text-text-primary">
                    ★ {worker.rating}
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-medium mb-1.5">
                  {worker.skill} · {worker.distance}
                </p>
                <div
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${worker.status === 'available' ? 'bg-success/10 text-success-dark dark:text-success' : 'bg-warning/10 text-warning-dark dark:text-warning'}`}>
                
                  {worker.status === 'available' ?
                'Available Now' :
                'Busy until 3PM'}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChatClick?.(worker.id);
                }}
                className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-text-primary hover:bg-background transition-colors shadow-sm">
                
                  <MessageCircleIcon className="w-4 h-4" />
                </button>
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`📱 Opening WhatsApp for ${worker.name}...`);
                }}
                className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm hover:bg-[#20bd5a] transition-colors">
                
                  <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastVisible &&
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface text-text-primary px-4 py-3 rounded-xl shadow-elevated border border-border z-50 animate-fade-in flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      }
    </div>);

}