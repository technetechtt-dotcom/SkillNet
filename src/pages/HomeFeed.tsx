import React, { useEffect, useState, Component } from 'react';
import {
  BellIcon,
  SearchIcon,
  PlusIcon,
  FlameIcon,
  TrendingUpIcon,
  UsersIcon,
  HashIcon,
  SparklesIcon,
  XIcon,
  PlayCircleIcon,
  CompassIcon,
  TrophyIcon } from
'lucide-react';
import { VideoCard } from '../components/ui/VideoCard';
import { UserAvatar } from '../components/ui/UserAvatar';
import { SkillTag } from '../components/ui/SkillTag';
import { ActionButton } from '../components/ui/ActionButton';
import { Video, User } from '../types';
import { formatCount } from '../utils/format';
// ── For You Feed Data ──
const FOR_YOU_VIDEOS: Video[] = [
{
  id: 'v1',
  userId: 'u1',
  user: {
    id: 'u1',
    name: 'Kwame Mensah',
    phone: '',
    location: 'Accra',
    skills: [],
    trustScore: 95,
    completedJobs: 42,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=kwame'
  },
  title: 'Fixing a complex engine issue',
  skillCategory: 'Mechanic',
  description:
  'Watch how I diagnose and repair this Toyota engine knocking sound. Always check your oil levels! 🔧🚗',
  thumbnail:
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 1240,
  comments: 85,
  shares: 32,
  duration: '0:45'
},
{
  id: 'v2',
  userId: 'u2',
  user: {
    id: 'u2',
    name: 'Amara Okafor',
    phone: '',
    location: 'Lagos',
    skills: [],
    trustScore: 98,
    completedJobs: 120,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=amara'
  },
  title: 'Modern wiring for new home',
  skillCategory: 'Electrician',
  description:
  'Clean and safe electrical panel installation for a new residential building in Lekki. Safety first! ⚡',
  thumbnail:
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 856,
  comments: 42,
  shares: 15,
  duration: '1:12'
},
{
  id: 'v3',
  userId: 'u3',
  user: {
    id: 'u3',
    name: 'Thabo Molefe',
    phone: '',
    location: 'Cape Town',
    skills: [],
    trustScore: 90,
    completedJobs: 35,
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=thabo'
  },
  title: 'Custom dining table build',
  skillCategory: 'Carpenter',
  description:
  'Crafting a beautiful 8-seater dining table from reclaimed local wood. The finish is incredible! 🪚🪵',
  thumbnail:
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 2100,
  comments: 156,
  shares: 89,
  duration: '0:58'
},
{
  id: 'v4',
  userId: 'u4',
  user: {
    id: 'u4',
    name: 'Aisha Bello',
    phone: '',
    location: 'Kano',
    skills: [],
    trustScore: 88,
    completedJobs: 28,
    rating: 4.6,
    avatar: 'https://i.pravatar.cc/150?u=aisha'
  },
  title: 'Beautiful braids tutorial',
  skillCategory: 'Hairdresser',
  description:
  'Step-by-step guide to creating stunning goddess braids. Perfect for any occasion! 💇‍♀️✨',
  thumbnail:
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 3200,
  comments: 210,
  shares: 145,
  duration: '2:30'
},
{
  id: 'v5',
  userId: 'u5',
  user: {
    id: 'u5',
    name: 'Kofi Asante',
    phone: '',
    location: 'Kumasi',
    skills: [],
    trustScore: 92,
    completedJobs: 55,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=kofi'
  },
  title: 'Organic farm harvest day',
  skillCategory: 'Farmer',
  description:
  'Harvesting fresh vegetables from our organic farm. From soil to table, everything is natural! 🌾🥬',
  thumbnail:
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 980,
  comments: 67,
  shares: 41,
  duration: '1:45'
}];

// ── Following Feed Data ──
const FOLLOWING_VIDEOS: Video[] = [
{
  id: 'fv1',
  userId: 'u2',
  user: {
    id: 'u2',
    name: 'Amara Okafor',
    phone: '',
    location: 'Lagos',
    skills: [],
    trustScore: 98,
    completedJobs: 120,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=amara'
  },
  title: 'Solar panel installation guide',
  skillCategory: 'Electrician',
  description:
  'Full walkthrough of a residential solar panel setup. Going green saves money long-term! ☀️⚡',
  thumbnail:
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 432,
  comments: 28,
  shares: 19,
  duration: '2:15'
},
{
  id: 'fv2',
  userId: 'u3',
  user: {
    id: 'u3',
    name: 'Thabo Molefe',
    phone: '',
    location: 'Cape Town',
    skills: [],
    trustScore: 90,
    completedJobs: 35,
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=thabo'
  },
  title: 'Restoring an antique chair',
  skillCategory: 'Carpenter',
  description:
  'Bringing this 50-year-old chair back to life with careful sanding and a fresh coat of varnish 🪑✨',
  thumbnail:
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 287,
  comments: 34,
  shares: 12,
  duration: '1:30'
},
{
  id: 'fv3',
  userId: 'u6',
  user: {
    id: 'u6',
    name: 'Zainab Mwangi',
    phone: '',
    location: 'Nairobi',
    skills: [],
    trustScore: 94,
    completedJobs: 67,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=zainab'
  },
  title: 'Perfect jollof rice recipe',
  skillCategory: 'Chef',
  description:
  'My secret jollof rice recipe that wins every party! The smoky flavor is the key 🍚🔥',
  thumbnail:
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 1890,
  comments: 203,
  shares: 156,
  duration: '3:20'
}];

const SUGGESTED_USERS: {
  user: User;
  skill: string;
}[] = [
{
  user: {
    id: 'su1',
    name: 'Fatima Hassan',
    phone: '',
    location: 'Dar es Salaam',
    skills: [],
    trustScore: 91,
    completedJobs: 38,
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=fatima'
  },
  skill: 'Tailor'
},
{
  user: {
    id: 'su2',
    name: 'Chidi Eze',
    phone: '',
    location: 'Enugu',
    skills: [],
    trustScore: 87,
    completedJobs: 22,
    rating: 4.5,
    avatar: 'https://i.pravatar.cc/150?u=chidi'
  },
  skill: 'Painter'
},
{
  user: {
    id: 'su3',
    name: 'Grace Wanjiku',
    phone: '',
    location: 'Mombasa',
    skills: [],
    trustScore: 96,
    completedJobs: 89,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=grace'
  },
  skill: 'Plumber'
},
{
  user: {
    id: 'su4',
    name: 'Yusuf Adeyemi',
    phone: '',
    location: 'Ibadan',
    skills: [],
    trustScore: 85,
    completedJobs: 15,
    rating: 4.4,
    avatar: 'https://i.pravatar.cc/150?u=yusuf'
  },
  skill: 'Driver'
}];

// ── Trending Feed Data ──
const TRENDING_VIDEOS: (Video & {
  rank: number;
  trendGrowth: string;
})[] = [
{
  id: 'tv1',
  userId: 'u7',
  rank: 1,
  trendGrowth: '+340%',
  user: {
    id: 'u7',
    name: 'Nia Osei',
    phone: '',
    location: 'Accra',
    skills: [],
    trustScore: 97,
    completedJobs: 156,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=nia'
  },
  title: 'Speed wiring challenge',
  skillCategory: 'Electrician',
  description:
  'Can I wire an entire room in under 30 minutes? Watch to find out! The result will shock you ⚡🏠',
  thumbnail:
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 45200,
  comments: 3400,
  shares: 8900,
  duration: '0:58'
},
{
  id: 'tv2',
  userId: 'u8',
  rank: 2,
  trendGrowth: '+210%',
  user: {
    id: 'u8',
    name: 'Emeka Nwosu',
    phone: '',
    location: 'Lagos',
    skills: [],
    trustScore: 93,
    completedJobs: 78,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=emeka'
  },
  title: 'Building a house with ₦500k',
  skillCategory: 'Carpenter',
  description:
  'Part 1 of my budget home build series. Proving you can build quality on a tight budget! 🏗️💰',
  thumbnail:
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 38700,
  comments: 2800,
  shares: 12400,
  duration: '4:30'
},
{
  id: 'tv3',
  userId: 'u9',
  rank: 3,
  trendGrowth: '+180%',
  user: {
    id: 'u9',
    name: 'Blessing Adebayo',
    phone: '',
    location: 'Abuja',
    skills: [],
    trustScore: 99,
    completedJobs: 210,
    rating: 5.0,
    avatar: 'https://i.pravatar.cc/150?u=blessing'
  },
  title: 'From zero to master plumber',
  skillCategory: 'Plumber',
  description:
  'My 5-year journey from apprentice to running my own plumbing company. Never give up! 🔧💪',
  thumbnail:
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 29100,
  comments: 4200,
  shares: 7600,
  duration: '6:12'
},
{
  id: 'tv4',
  userId: 'u10',
  rank: 4,
  trendGrowth: '+150%',
  user: {
    id: 'u10',
    name: 'Amina Diallo',
    phone: '',
    location: 'Dakar',
    skills: [],
    trustScore: 91,
    completedJobs: 44,
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=amina'
  },
  title: 'African print dress in 2 hours',
  skillCategory: 'Tailor',
  description:
  'Watch me create a stunning Ankara dress from scratch. The pattern matching is everything! 👗🎨',
  thumbnail:
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 22400,
  comments: 1900,
  shares: 5300,
  duration: '2:45'
},
{
  id: 'tv5',
  userId: 'u11',
  rank: 5,
  trendGrowth: '+120%',
  user: {
    id: 'u11',
    name: 'Samuel Kamau',
    phone: '',
    location: 'Nairobi',
    skills: [],
    trustScore: 89,
    completedJobs: 31,
    rating: 4.6,
    avatar: 'https://i.pravatar.cc/150?u=samuel'
  },
  title: 'Vertical farming in a small space',
  skillCategory: 'Farmer',
  description:
  'How I grow enough vegetables for 20 families using just a 10x10 meter space 🌱🏙️',
  thumbnail:
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  likes: 18600,
  comments: 1200,
  shares: 4100,
  duration: '3:15'
}];

const TRENDING_CATEGORIES = [
'All',
'🔧 Mechanic',
'⚡ Electrical',
'🪚 Carpentry',
'👨‍🍳 Cooking',
'💇 Hair',
'🌾 Farming',
'👔 Tailoring'];

const MOCK_STORIES = [
{
  id: 'your-story',
  userName: 'Your Story',
  userAvatar: '',
  isYourStory: true
},
{
  id: 's1',
  userName: 'Kwame',
  userAvatar: 'https://i.pravatar.cc/150?u=kwame'
},
{
  id: 's2',
  userName: 'Amara',
  userAvatar: 'https://i.pravatar.cc/150?u=amara'
},
{
  id: 's3',
  userName: 'Thabo',
  userAvatar: 'https://i.pravatar.cc/150?u=thabo'
},
{
  id: 's4',
  userName: 'Zainab',
  userAvatar: 'https://i.pravatar.cc/150?u=zainab'
},
{
  id: 's5',
  userName: 'Kofi',
  userAvatar: 'https://i.pravatar.cc/150?u=kofi'
}];

// formatCount imported from utils/format
// ── Following Tab Component ──
function FollowingFeed() {
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const toggleFollow = (userId: string) => {
    setFollowedUsers((prev) =>
    prev.includes(userId) ?
    prev.filter((id) => id !== userId) :
    [...prev, userId]
    );
  };
  return (
    <div className="p-4 space-y-4">
      {/* Stories-style row of followed creators */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
        {[
        ...FOLLOWING_VIDEOS.map((v) => v.user),
        ...SUGGESTED_USERS.slice(0, 2).map((s) => s.user)].
        map((user) =>
        <div
          key={user.id}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent group-hover:scale-105 transition-transform duration-300">
              <div className="p-0.5 bg-background rounded-full">
                <UserAvatar src={user.avatar} name={user.name} size="lg" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-text-primary w-16 text-center truncate">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>

      {/* Following Videos */}
      {FOLLOWING_VIDEOS.map((video) =>
      <VideoCard key={video.id} video={video} />
      )}

      {/* Suggested People to Follow */}
      <div className="bg-surface rounded-3xl border border-border p-5 mt-2 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-text-primary text-lg">
            Suggested for You
          </h3>
        </div>
        <p className="text-sm text-text-secondary mb-5 font-medium">
          Follow skilled workers to see their latest videos and updates.
        </p>
        <div className="space-y-5">
          {SUGGESTED_USERS.map((item) =>
          <div key={item.user.id} className="flex items-center gap-3">
              <UserAvatar
              src={item.user.avatar}
              name={item.user.name}
              size="md"
              verified={item.user.trustScore > 90} />
            
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-text-primary truncate">
                  {item.user.name}
                </h4>
                <p className="text-xs text-text-secondary font-medium">
                  {item.skill} · {item.user.location}
                </p>
              </div>
              <button
              onClick={() => toggleFollow(item.user.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold min-h-[40px] transition-all duration-200 active:scale-95 ${followedUsers.includes(item.user.id) ? 'bg-surface border border-border text-text-secondary' : 'bg-primary text-white shadow-md shadow-primary/20'}`}>
              
                {followedUsers.includes(item.user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* End of feed message */}
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-border">
          <span className="text-2xl">🎉</span>
        </div>
        <p className="text-sm font-bold text-text-primary">
          You're all caught up!
        </p>
        <p className="text-xs text-text-secondary mt-1 font-medium">
          Follow more people to see more content
        </p>
      </div>
    </div>);

}
// ── Trending Tab Component ──
function TrendingFeed({ onChallenges }: {onChallenges: () => void;}) {
  const [activeCategory, setActiveCategory] = useState('All');
  return (
    <div>
      {/* Trending Header */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-secondary/20 p-1.5 rounded-lg">
            <FlameIcon className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="font-black text-text-primary text-lg tracking-tight flex-1">
            Trending This Week
          </h2>
          <button
            onClick={onChallenges}
            className="flex items-center gap-1.5 bg-secondary/10 text-secondary-dark px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-secondary/20 transition-colors">
            
            <TrophyIcon className="w-3.5 h-3.5" /> Challenges
          </button>
        </div>
        <p className="text-xs text-text-secondary font-medium ml-10">
          Most popular skill videos across Africa
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-4 py-3 border-b border-border bg-surface">
        {TRENDING_CATEGORIES.map((cat) =>
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold min-h-[40px] transition-all duration-200 ${activeCategory === cat ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-background text-text-secondary border border-border hover:border-primary/30'}`}>
          
            {cat}
          </button>
        )}
      </div>

      {/* Top 3 Spotlight */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUpIcon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-text-primary text-lg">Top Videos</h3>
        </div>

        {/* #1 Featured Large */}
        {TRENDING_VIDEOS.slice(0, 1).map((video) =>
        <div key={video.id} className="relative mb-5">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-secondary to-amber-400 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
                #1 Trending
              </span>
              <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 border border-white/10">
                <FlameIcon className="w-3 h-3 text-secondary" />
                {video.trendGrowth}
              </span>
            </div>
            <VideoCard video={video} />
          </div>
        )}

        {/* #2-5 Compact List */}
        <div className="space-y-3">
          {TRENDING_VIDEOS.slice(1).map((video) =>
          <div
            key={video.id}
            className="flex gap-3 bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-card transition-shadow duration-300 group">
            
              {/* Rank */}
              <div className="flex items-center justify-center w-10 flex-shrink-0 bg-background/50 border-r border-border">
                <span
                className={`text-lg font-black ${video.rank <= 3 ? 'text-secondary' : 'text-text-secondary'}`}>
                
                  {video.rank}
                </span>
              </div>

              {/* Thumbnail */}
              <div className="relative w-24 aspect-[3/4] flex-shrink-0 bg-black my-2 rounded-xl overflow-hidden shadow-sm">
                <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
                <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 py-3 pr-3 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <UserAvatar
                    src={video.user.avatar}
                    name={video.user.name}
                    size="sm" />
                  
                    <span className="text-xs text-text-secondary font-medium truncate">
                      {video.user.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      ❤️ {formatCount(video.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {formatCount(video.comments)}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-success flex items-center gap-0.5 bg-success/10 px-1.5 py-0.5 rounded-md">
                    <TrendingUpIcon className="w-3 h-3" />
                    {video.trendGrowth}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trending Skills Section */}
        <div className="mt-8 bg-surface rounded-3xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <HashIcon className="w-4 h-4 text-accent" />
            </div>
            <h3 className="font-bold text-text-primary text-lg">
              Trending Skills
            </h3>
          </div>
          <div className="space-y-4">
            {[
            {
              skill: 'Solar Installation',
              icon: '☀️',
              posts: '2.4K videos',
              growth: '+89%'
            },
            {
              skill: 'Budget Building',
              icon: '🏗️',
              posts: '1.8K videos',
              growth: '+67%'
            },
            {
              skill: 'Vertical Farming',
              icon: '🌱',
              posts: '1.2K videos',
              growth: '+54%'
            },
            {
              skill: 'Ankara Design',
              icon: '👗',
              posts: '3.1K videos',
              growth: '+45%'
            },
            {
              skill: 'EV Repair',
              icon: '🔋',
              posts: '890 videos',
              growth: '+120%'
            }].
            map((item, i) =>
            <div
              key={i}
              className="flex items-center gap-3 p-2 hover:bg-background rounded-xl transition-colors cursor-pointer">
              
                <span className="text-lg font-black text-text-secondary/50 w-6 text-center">
                  {i + 1}
                </span>
                <div className="w-12 h-12 bg-surface shadow-sm border border-border rounded-xl flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text-primary">
                    {item.skill}
                  </h4>
                  <p className="text-xs text-text-secondary font-medium">
                    {item.posts}
                  </p>
                </div>
                <div className="bg-success/10 text-success px-2 py-1 rounded-lg">
                  <span className="text-xs font-bold">{item.growth}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-6" />
      </div>
    </div>);

}
// ── Main HomeFeed Component ──
interface HomeFeedProps {
  onUploadVideo: () => void;
  onNotifications?: () => void;
  onSearch?: () => void;
  onStories?: () => void;
  onExplore?: () => void;
  onChallenges?: () => void;
  onDuet?: () => void;
}
export function HomeFeed({
  onUploadVideo,
  onNotifications,
  onSearch,
  onStories,
  onExplore,
  onChallenges,
  onDuet
}: HomeFeedProps) {
  const [activeTab, setActiveTab] = useState('foryou');
  const [showInsight, setShowInsight] = useState(true);
  const [showTraining, setShowTraining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);
  const handleWatchTraining = () => {
    setShowTraining(true);
    setTimeout(() => {
      setShowTraining(false);
    }, 3000);
  };
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-4">
          <div className="h-48 bg-surface rounded-3xl border border-border animate-pulse"></div>
          <div className="flex gap-3 overflow-hidden">
            <div className="h-16 w-32 bg-surface rounded-xl border border-border animate-pulse flex-shrink-0"></div>
            <div className="h-16 w-32 bg-surface rounded-xl border border-border animate-pulse flex-shrink-0"></div>
            <div className="h-16 w-32 bg-surface rounded-xl border border-border animate-pulse flex-shrink-0"></div>
          </div>
          <div className="aspect-[9/16] bg-surface rounded-3xl border border-border animate-pulse"></div>
        </div>);

    }
    switch (activeTab) {
      case 'following':
        return <FollowingFeed />;
      case 'trending':
        return <TrendingFeed onChallenges={onChallenges || (() => {})} />;
      default:
        return (
          <div className="p-4 space-y-4">
            {/* Stories Row */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
              {MOCK_STORIES.map((story) =>
              <button
                key={story.id}
                onClick={() =>
                story.isYourStory ? onUploadVideo() : onStories?.()
                }
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
                
                  <div
                  className={`relative ${story.isYourStory ? '' : 'p-0.5 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent'}`}>
                  
                    {story.isYourStory ?
                  <div className="w-16 h-16 rounded-full bg-surface border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary transition-colors">
                        <PlusIcon className="w-6 h-6 text-text-secondary group-hover:text-primary" />
                      </div> :

                  <div className="p-0.5 bg-background rounded-full">
                        <UserAvatar
                      src={story.userAvatar}
                      name={story.userName}
                      size="md" />
                    
                      </div>
                  }
                  </div>
                  <span className="text-[11px] font-bold text-text-primary w-16 text-center truncate">
                    {story.userName}
                  </span>
                </button>
              )}
            </div>

            {/* Predictive Insight Card */}
            {showInsight &&
            <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 rounded-3xl p-5 border border-accent/20 shadow-glow relative animate-fade-in mb-2">
                <button
                onClick={() => setShowInsight(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
                
                  <XIcon className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 bg-surface/80 backdrop-blur-sm w-fit px-2.5 py-1 rounded-lg mb-3 shadow-sm border border-white/50">
                  <SparklesIcon className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                    AI Insight
                  </span>
                </div>

                <h3 className="text-lg font-black text-text-primary mb-1 leading-tight">
                  Skill of the Month:
                  <br />
                  Solar Installation
                </h3>
                <p className="text-sm text-text-secondary font-medium mb-4 pr-6">
                  Solar installers in Lagos are earning{' '}
                  <strong className="text-success">42% more</strong> this month
                  due to grid updates.
                </p>

                {/* Mini Chart */}
                <div className="flex items-end gap-2 h-12 mb-5 opacity-80">
                  <div
                  className="w-8 bg-primary/30 rounded-t-md"
                  style={{
                    height: '40%'
                  }} />
                
                  <div
                  className="w-8 bg-primary/50 rounded-t-md"
                  style={{
                    height: '60%'
                  }} />
                
                  <div
                  className="w-8 bg-gradient-to-t from-primary to-teal-400 rounded-t-md relative shadow-sm"
                  style={{
                    height: '100%'
                  }}>
                  
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">
                      +42%
                    </div>
                  </div>
                </div>

                {showTraining ?
              <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center shadow-sm border border-border">
                    <img
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Training"
                  className="absolute inset-0 w-full h-full object-cover opacity-50" />
                
                    <div className="relative z-10 flex flex-col items-center">
                      <PlayCircleIcon className="w-8 h-8 text-white mb-2 animate-pulse" />
                      <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                        Training video playing...
                      </span>
                    </div>
                  </div> :

              <button
                onClick={handleWatchTraining}
                className="w-full bg-surface hover:bg-background transition-colors text-text-primary font-bold text-sm py-3 rounded-xl shadow-sm border border-border flex items-center justify-center gap-2">
                
                    <PlayCircleIcon className="w-4 h-4 text-primary" /> Watch
                    Free 30s Training
                  </button>
              }
              </div>
            }

            {/* Hot Skills Scroll */}
            <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-4 px-4 mb-2">
              <div className="bg-surface border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm flex-shrink-0">
                <span className="text-lg">☀️</span>
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    Solar
                  </p>
                  <p className="text-xs font-black text-success">₦85k/job</p>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm flex-shrink-0">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    Wiring
                  </p>
                  <p className="text-xs font-black text-success">₦45k/job</p>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm flex-shrink-0">
                <span className="text-lg">🔧</span>
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    Plumbing
                  </p>
                  <p className="text-xs font-black text-text-primary">
                    ₦30k/job
                  </p>
                </div>
              </div>
            </div>

            {FOR_YOU_VIDEOS.map((video) =>
            <VideoCard key={video.id} video={video} onDuet={onDuet} />
            )}
          </div>);

    }
  };
  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface/95 backdrop-blur-md z-20 flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-teal-500 rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-white text-sm font-black tracking-tighter">
              SN
            </span>
          </div>
          <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary tracking-tight">
            SkillNet
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onExplore}
            className="p-2 text-text-secondary hover:text-primary transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-surface">
            
            <CompassIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onNotifications}
            className="p-2 text-text-secondary hover:text-primary transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center relative rounded-full hover:bg-surface">
            
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface shadow-sm" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2 gap-6 border-b border-border bg-surface z-10 flex-shrink-0">
        {[
        {
          id: 'foryou',
          label: 'For You'
        },
        {
          id: 'following',
          label: 'Following'
        },
        {
          id: 'trending',
          label: 'Trending'
        }].
        map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-3 px-1 font-bold transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
          
            {tab.label}
            {tab.id === 'trending' &&
          <FlameIcon
            className={`w-3.5 h-3.5 inline-block ml-1 -mt-0.5 ${activeTab === tab.id ? 'text-secondary' : 'text-text-secondary'}`} />

          }
            {activeTab === tab.id &&
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(13,148,136,0.5)]" />
          }
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {renderTabContent()}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onUploadVideo}
        className="absolute bottom-5 right-5 w-14 h-14 bg-gradient-to-r from-primary to-teal-500 text-white rounded-2xl shadow-elevated flex items-center justify-center active:scale-90 transition-transform z-30 border border-white/20"
        aria-label="Upload Video">
        
        <PlusIcon className="w-7 h-7" strokeWidth={2.5} />
      </button>
    </div>);

}