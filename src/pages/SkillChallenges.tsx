import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { UserAvatar } from '../components/ui/UserAvatar';
import { api } from '../lib/api';

interface SkillChallengesProps {
  onBack: () => void;
}

export function SkillChallenges({ onBack }: SkillChallengesProps) {
  const queryClient = useQueryClient();

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => api.challenges.list(),
  });

  const { data: featured } = useQuery({
    queryKey: ['challenges', 'featured'],
    queryFn: () => api.challenges.featured(),
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => api.challenges.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const activeChallenge = featured || challenges.find((c) => c.status === 'active');
  const otherChallenges = challenges.filter((c) => c.id !== activeChallenge?.id);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Skill Challenges</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeChallenge && (
          <div className="bg-gradient-to-br from-primary/10 to-teal-500/10 border border-primary/20 rounded-3xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-3xl mb-2 block">{activeChallenge.emoji}</span>
                <h2 className="text-xl font-black text-text-primary">
                  {activeChallenge.name}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {activeChallenge.description}
                </p>
              </div>
              <span className="bg-primary text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md">
                Active
              </span>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                <UsersIcon className="w-4 h-4" />
                {activeChallenge.participants} joined
              </div>
              {activeChallenge.daysLeft !== undefined && (
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <CalendarIcon className="w-4 h-4" />
                  {activeChallenge.daysLeft} days left
                </div>
              )}
            </div>

            {activeChallenge.prize && (
              <div className="flex items-center gap-2 bg-surface rounded-xl p-3 border border-border mb-4">
                <TrophyIcon className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-bold text-text-primary">
                  Prize: {activeChallenge.prize}
                </span>
              </div>
            )}

            <ActionButton
              onClick={() => joinMutation.mutate(activeChallenge.id)}
              variant={activeChallenge.joined ? 'secondary' : 'gradient'}
              disabled={activeChallenge.joined || joinMutation.isPending}
              icon={
                activeChallenge.joined ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : undefined
              }>
              {activeChallenge.joined ? 'Joined!' : 'Join Challenge'}
            </ActionButton>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
            All Challenges
          </h3>
          <div className="space-y-3">
            {otherChallenges.map((ch) => (
              <div
                key={ch.id}
                className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-4">
                <span className="text-2xl">{ch.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-text-primary">{ch.name}</h4>
                  <p className="text-xs text-text-secondary">
                    {ch.category} · {ch.participants} participants
                  </p>
                  {ch.winners && ch.winners.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {ch.winners.map((w, i) => (
                        <UserAvatar key={i} src={w.avatar || undefined} name={w.name} size="sm" />
                      ))}
                    </div>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                    ch.status === 'active'
                      ? 'bg-primary/10 text-primary'
                      : ch.status === 'upcoming'
                        ? 'bg-info/10 text-info'
                        : 'bg-surface border border-border text-text-secondary'
                  }`}>
                  {ch.status === 'upcoming' && ch.startsIn
                    ? `In ${ch.startsIn}d`
                    : ch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
