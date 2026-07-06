import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
  PlayCircleIcon,
  TrophyIcon,
} from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ActionButton } from '../components/ui/ActionButton';
import { api } from '../lib/api';

interface ExploreProps {
  onBack: () => void;
  onWorkerClick: (id: string) => void;
  onChallenges: () => void;
}

export function Explore({ onBack, onWorkerClick, onChallenges }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['explore', activeCategory, searchQuery],
    queryFn: () =>
      api.explore.get({
        category: activeCategory || undefined,
        q: searchQuery || undefined,
      }),
  });

  const categories = data?.categories ?? [];
  const featuredWorkers = data?.featuredWorkers ?? [];
  const trendingVideos = data?.trendingVideos ?? [];
  const activeChallenge = data?.activeChallenge;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 pt-4 pb-3 flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex-1">
            Explore
          </h1>
          <button
            onClick={onBack}
            className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">
            Cancel
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-text-secondary" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, workers, or jobs..."
            className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="px-4 py-4">
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
                Categories
              </h2>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                <button
                  onClick={() => setActiveCategory('')}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                    !activeCategory
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-border text-text-secondary'
                  }`}>
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                      activeCategory === cat.name
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-border text-text-secondary'
                    }`}>
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" /> Featured Workers
                </h2>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {featuredWorkers.map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => onWorkerClick(worker.id)}
                    className="flex-shrink-0 w-28 bg-surface rounded-2xl p-3 border border-border text-center hover:border-primary/30 transition-colors">
                    <UserAvatar
                      src={worker.avatar || undefined}
                      name={worker.name}
                      size="lg"
                      className="mx-auto mb-2"
                    />
                    <p className="font-bold text-xs text-text-primary truncate">
                      {worker.name}
                    </p>
                    <p className="text-[10px] text-text-secondary">{worker.skill}</p>
                    <p className="text-[10px] text-amber-500 font-bold mt-1">
                      ★ {worker.rating}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4" /> Trending Videos
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {trendingVideos.map((video) => (
                  <div
                    key={video.id}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border">
                    <img
                      src={video.image}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1 text-white/80 text-[10px] mb-1">
                        <PlayCircleIcon className="w-3 h-3" />
                        {video.views} views
                      </div>
                      <p className="text-white text-xs font-bold line-clamp-2">
                        {video.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeChallenge && (
              <div className="px-4 pb-6">
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-3xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrophyIcon className="w-5 h-5 text-accent" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">
                      Active Challenge
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-text-primary mb-1">
                    {activeChallenge.hashtag}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    {activeChallenge.participants}+ workers joined ·{' '}
                    {activeChallenge.daysLeft} days left
                  </p>
                  <ActionButton onClick={onChallenges} variant="gradient" size="md">
                    Join Challenge
                  </ActionButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
