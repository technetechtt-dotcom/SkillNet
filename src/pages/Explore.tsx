import React, { useState } from 'react';
import {
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
  PlayCircleIcon,
  TrophyIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ActionButton } from '../components/ui/ActionButton';
interface ExploreProps {
  onBack: () => void;
  onWorkerClick: (id: string) => void;
  onChallenges: () => void;
}
const CATEGORIES = [
{
  name: 'Electrician',
  icon: '⚡'
},
{
  name: 'Mechanic',
  icon: '🔧'
},
{
  name: 'Carpenter',
  icon: '🪚'
},
{
  name: 'Plumber',
  icon: '🔨'
},
{
  name: 'Chef',
  icon: '👨‍🍳'
},
{
  name: 'Farmer',
  icon: '🌾'
}];

const FEATURED_WORKERS = [
{
  id: 'w1',
  name: 'Kwame Mensah',
  skill: 'Mechanic',
  rating: 4.8,
  avatar: 'https://i.pravatar.cc/150?u=kwame'
},
{
  id: 'w2',
  name: 'Amara Okafor',
  skill: 'Electrician',
  rating: 4.9,
  avatar: 'https://i.pravatar.cc/150?u=amara'
},
{
  id: 'w3',
  name: 'Thabo Molefe',
  skill: 'Carpenter',
  rating: 4.7,
  avatar: 'https://i.pravatar.cc/150?u=thabo'
}];

const TRENDING_VIDEOS = [
{
  id: 'v1',
  title: 'Speed wiring challenge',
  views: '45.2K',
  image:
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
},
{
  id: 'v2',
  title: 'Budget home build',
  views: '38.7K',
  image:
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
},
{
  id: 'v3',
  title: 'Master plumber tips',
  views: '29.1K',
  image:
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
},
{
  id: 'v4',
  title: 'Ankara dress making',
  views: '22.4K',
  image:
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
}];

export function Explore({ onBack, onWorkerClick, onChallenges }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Electrician');
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header & Search */}
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
            placeholder="Search skills, workers, or videos..."
            className="w-full bg-background border border-border rounded-2xl py-3 pl-10 pr-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Categories */}
        <div className="py-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 pb-2">
            {CATEGORIES.map((cat) =>
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center gap-2 flex-shrink-0 p-3 rounded-2xl border-2 transition-all min-w-[80px] ${activeCategory === cat.name ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-surface hover:border-primary/30'}`}>
              
                <span className="text-2xl">{cat.icon}</span>
                <span
                className={`text-xs font-bold ${activeCategory === cat.name ? 'text-primary' : 'text-text-secondary'}`}>
                
                  {cat.name}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Featured Workers */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-primary" /> Featured Workers
            </h2>
            <span className="text-xs font-bold text-primary">See All</span>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2 -mx-4 px-4">
            {FEATURED_WORKERS.map((worker) =>
            <div
              key={worker.id}
              className="bg-surface border border-border rounded-3xl p-4 flex-shrink-0 w-48 shadow-sm flex flex-col items-center text-center">
              
                <UserAvatar
                src={worker.avatar}
                name={worker.name}
                size="lg"
                className="mb-3 shadow-sm" />
              
                <h3 className="font-bold text-text-primary text-sm w-full truncate">
                  {worker.name}
                </h3>
                <p className="text-xs text-text-secondary font-medium mb-1">
                  {worker.skill}
                </p>
                <p className="text-xs font-bold text-text-primary mb-4">
                  ★ {worker.rating}
                </p>
                <ActionButton
                onClick={() => onWorkerClick(worker.id)}
                variant="outline"
                size="sm"
                className="w-full">
                
                  View Profile
                </ActionButton>
              </div>
            )}
          </div>
        </div>

        {/* Trending Challenges */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-secondary" /> Trending
              Challenges
            </h2>
            <button
              onClick={onChallenges}
              className="text-xs font-bold text-secondary">
              
              View All
            </button>
          </div>
          <div
            className="bg-gradient-to-r from-secondary/10 to-orange-500/10 rounded-3xl p-5 border border-secondary/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={onChallenges}>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">⚡</span>
              <span className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                Active Now
              </span>
            </div>
            <h3 className="font-black text-xl text-text-primary mb-1">
              #FastestWire
            </h3>
            <p className="text-sm text-text-secondary font-medium mb-3">
              Show your fastest wiring job! Top 3 win badges.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <UserAvatar
                  src="https://i.pravatar.cc/150?u=1"
                  name="User 1"
                  size="sm"
                  className="ring-2 ring-surface" />
                
                <UserAvatar
                  src="https://i.pravatar.cc/150?u=2"
                  name="User 2"
                  size="sm"
                  className="ring-2 ring-surface" />
                
                <UserAvatar
                  src="https://i.pravatar.cc/150?u=3"
                  name="User 3"
                  size="sm"
                  className="ring-2 ring-surface" />
                
              </div>
              <span className="text-xs font-bold text-text-secondary">
                +139 joined
              </span>
            </div>
          </div>
        </div>

        {/* Top Videos */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5 text-accent" /> Top Videos This
              Week
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TRENDING_VIDEOS.map((video) =>
            <div
              key={video.id}
              className="relative aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              
                <img
                src={video.image}
                alt={video.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircleIcon className="w-10 h-10 text-white/80" />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-xs line-clamp-2 mb-1 drop-shadow-md">
                    {video.title}
                  </p>
                  <p className="text-white/80 text-[10px] font-bold flex items-center gap-1">
                    <PlayCircleIcon className="w-3 h-3" /> {video.views}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}