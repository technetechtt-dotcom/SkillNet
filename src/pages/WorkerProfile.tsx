import React from 'react';
import {
  ArrowLeftIcon,
  MapPinIcon,
  ShieldIcon,
  StarIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  BriefcaseIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserAvatar } from '../components/ui/UserAvatar';
import { SkillTag } from '../components/ui/SkillTag';
import { ActionButton } from '../components/ui/ActionButton';
import { EndorsementsSection } from '../components/EndorsementsSection';
import { api } from '../lib/api';

interface WorkerProfileProps {
  workerId: string;
  onBack: () => void;
  onMessage: () => void;
  onHire: () => void;
}

export function WorkerProfile({
  workerId,
  onBack,
  onMessage,
  onHire,
}: WorkerProfileProps) {
  const { data: worker, isLoading } = useQuery({
    queryKey: ['users', workerId],
    queryFn: () => api.users.get(workerId),
  });

  const { data: allVideos = [] } = useQuery({
    queryKey: ['videos'],
    queryFn: () => api.videos.list(),
  });

  const workerVideos = allVideos.filter((v) => v.userId === workerId);

  if (isLoading || !worker) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="relative h-32 bg-gradient-to-br from-secondary via-orange-500 to-red-500 flex-shrink-0">
        <div className="absolute top-4 left-4">
          <button
            onClick={onBack}
            className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-black/40 transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 relative pb-6 bg-surface border-b border-border">
        <div className="absolute -top-12 left-4">
          <UserAvatar
            name={worker.name}
            src={worker.avatar || undefined}
            size="xl"
            className="border-4 border-surface shadow-md"
          />
          {worker.isOnline && (
            <div className="absolute bottom-1 right-1 bg-success text-white p-1 rounded-full border-2 border-surface">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="pt-12 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{worker.name}</h1>
            <div className="flex items-center gap-1 text-text-secondary mt-1">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{worker.location || 'Location not set'}</span>
            </div>
          </div>
          <span className="bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-full border border-success/20">
            {worker.isOnline ? 'Online' : 'Available'}
          </span>
        </div>

        <p className="mt-4 text-text-secondary text-sm leading-relaxed">
          {worker.bio || 'No bio provided.'}
        </p>

        <div className="flex justify-between mt-6 p-4 bg-background rounded-2xl border border-border">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-primary mb-1">
              <ShieldIcon className="w-5 h-5" />
              <span className="font-bold text-lg">{worker.trustScore}</span>
            </div>
            <span className="text-xs text-text-secondary">Trust Score</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <span className="font-bold text-lg text-text-primary mb-1">
              {worker.completedJobs}
            </span>
            <span className="text-xs text-text-secondary">Jobs Done</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-secondary mb-1">
              <StarIcon className="w-5 h-5 fill-secondary" />
              <span className="font-bold text-lg">{worker.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-text-secondary">Rating</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <ActionButton
            variant="outline"
            size="md"
            className="flex-1 border-border text-text-primary hover:bg-background"
            onClick={onMessage}
            icon={<MessageCircleIcon className="w-5 h-5" />}>
            Message
          </ActionButton>
          <ActionButton
            variant="gradient"
            size="md"
            className="flex-1 shadow-md"
            onClick={onHire}
            icon={<BriefcaseIcon className="w-5 h-5" />}>
            Hire
          </ActionButton>
        </div>
      </div>

      <div className="bg-surface mt-2 p-5 border-y border-border shadow-sm">
        <h2 className="text-lg font-bold text-text-primary mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {worker.skills.length === 0 && (
            <p className="text-sm text-text-secondary">No skills listed.</p>
          )}
          {worker.skills.map((skill) => (
            <SkillTag
              key={skill.id}
              name={skill.name}
              icon={skill.icon}
              level={skill.level}
              size="lg"
            />
          ))}
        </div>
      </div>

      <EndorsementsSection workerId={worker.id} skills={worker.skills} />

      <div className="bg-surface mt-2 p-4 border-y border-border pb-8">
        <h2 className="text-lg font-bold text-text-primary mb-4">Portfolio Videos</h2>
        {workerVideos.length === 0 ? (
          <p className="text-sm text-text-secondary">No portfolio videos yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {workerVideos.map((video) => (
              <div
                key={video.id}
                className="relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden">
                <img
                  src={video.thumbnail || 'https://picsum.photos/seed/v/400/600'}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md">
                  {video.likes} likes
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
