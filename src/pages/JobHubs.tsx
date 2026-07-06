import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  FilterIcon,
  MessageCircleIcon,
  MapPinIcon,
} from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { FilterChip } from '../components/ui/FilterChip';
import { api, ApiNearbyWorker } from '../lib/api';

interface JobHubsProps {
  onBack: () => void;
  onWorkerClick: (workerId: string) => void;
  onChatClick?: (workerId: string) => void;
}

const FILTERS = ['All', 'Electrician', 'Plumber', 'Mechanic', 'Carpenter', 'Driver'];

const DEFAULT_CENTER = { lat: -26.2041, lng: 28.0473 };

function toMapPosition(
  workerLat: number,
  workerLng: number,
  centerLat: number,
  centerLng: number,
  range = 0.025
) {
  const top = ((centerLat + range - workerLat) / (2 * range)) * 100;
  const left = ((workerLng - (centerLng - range)) / (2 * range)) * 100;
  return {
    top: `${Math.min(88, Math.max(12, top))}%`,
    left: `${Math.min(88, Math.max(12, left))}%`,
  };
}

export function JobHubs({ onBack, onWorkerClick, onChatClick }: JobHubsProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCenter(DEFAULT_CENTER),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  const { data: workers = [], isLoading } = useQuery({
    queryKey: ['workers', 'nearby', center.lat, center.lng, activeFilter],
    queryFn: () =>
      api.workers.nearby({
        lat: center.lat,
        lng: center.lng,
        skill: activeFilter === 'All' ? undefined : activeFilter,
      }),
  });

  const workersWithPos = useMemo(
    () =>
      workers.map((w: ApiNearbyWorker) => ({
        ...w,
        pos: toMapPosition(w.latitude, w.longitude, center.lat, center.lng),
      })),
    [workers, center]
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary">Job Hubs</h1>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" /> Workers near you
            </p>
          </div>
        </div>
        <FilterIcon className="w-5 h-5 text-text-secondary" />
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-4 py-3 border-b border-border bg-surface flex-shrink-0">
        {FILTERS.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            selected={activeFilter === filter}
            onToggle={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      <div className="relative flex-1 min-h-[280px] bg-gradient-to-br from-teal-900/20 via-emerald-800/10 to-primary/5 border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(13,148,136,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg z-10" />

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          workersWithPos.map((worker) => (
            <button
              key={worker.id}
              onClick={() => onWorkerClick(worker.id)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
              style={{ top: worker.pos.top, left: worker.pos.left }}>
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full border-2 overflow-hidden shadow-lg ${
                    worker.status === 'available' ? 'border-success' : 'border-amber-400'
                  }`}>
                  <UserAvatar
                    src={worker.avatar || undefined}
                    name={worker.name}
                    size="sm"
                    className="w-full h-full"
                  />
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    worker.status === 'available' ? 'bg-success' : 'bg-amber-400'
                  }`}
                />
              </div>
            </button>
          ))
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {workersWithPos.length === 0 && !isLoading ? (
          <p className="text-center text-text-secondary py-8">
            No workers found nearby. Try a different filter.
          </p>
        ) : (
          workersWithPos.map((worker) => (
            <div
              key={worker.id}
              className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3">
              <UserAvatar
                src={worker.avatar || undefined}
                name={worker.name}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-text-primary">{worker.name}</h3>
                <p className="text-xs text-text-secondary">
                  {worker.skill} · {worker.distance} · ★ {worker.rating}
                </p>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    worker.status === 'available'
                      ? 'bg-success/10 text-success'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                  {worker.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onChatClick?.(worker.id)}
                  className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
                  <MessageCircleIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const phone = worker.phone.replace(/\D/g, '');
                    window.open(`https://wa.me/${phone}`, '_blank');
                    showToast(`Opening WhatsApp for ${worker.name}`);
                  }}
                  className="p-2.5 bg-success/10 text-success rounded-xl hover:bg-success/20 transition-colors text-lg">
                  💬
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {toastVisible && (
        <div className="absolute bottom-6 left-4 right-4 bg-surface border border-border rounded-xl px-4 py-3 shadow-elevated text-sm font-medium text-text-primary text-center z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
