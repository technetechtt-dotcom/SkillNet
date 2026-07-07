import React, { useState } from 'react';
import {
  MapPinIcon,
  ShieldIcon,
  StarIcon,
  SettingsIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
  ShieldCheckIcon,
  AwardIcon,
  ChevronRightIcon,
  BarChart3Icon,
  WalletIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { SkillTag } from '../components/ui/SkillTag';
import { ActionButton } from '../components/ui/ActionButton';
import { RatingStars } from '../components/ui/RatingStars';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
interface SkillProfileProps {
  onEditProfile?: () => void;
  onAddSkill?: () => void;
  onUploadVideo?: () => void;
  onToggleTheme?: () => void;
  onCertifications?: () => void;
  onSettings?: () => void;
  onShareProfile?: () => void;
  onImpactDashboard?: () => void;
  onWallet?: () => void;
  isDark?: boolean;
}
export function SkillProfile({
  onEditProfile,
  onAddSkill,
  onUploadVideo,
  onToggleTheme,
  onCertifications,
  onSettings,
  onShareProfile,
  onImpactDashboard,
  onWallet,
  isDark
}: SkillProfileProps) {
  const [safeMode, setSafeMode] = useState(false);
  const { user } = useAuth();

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.wallet.get(),
  });

  const { data: allVideos = [] } = useQuery({
    queryKey: ['videos'],
    queryFn: () => api.videos.list(),
  });

  const myVideos = allVideos.filter((v) => v.userId === user?.id);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Cover & Avatar */}
      <div className="relative h-40 bg-gradient-to-br from-primary via-teal-600 to-teal-800 flex-shrink-0">
        <div className="absolute top-4 right-4 flex gap-2">
          {onToggleTheme &&
          <button
            onClick={onToggleTheme}
            className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle dark mode">
            
              {isDark ?
            <SunIcon className="w-5 h-5" /> :

            <MoonIcon className="w-5 h-5" />
            }
            </button>
          }
          <button
            onClick={onSettings}
            className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-black/40 transition-colors">
            
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 relative pb-6 bg-surface border-b border-border">
        <div className="absolute -top-12 left-4">
          <UserAvatar
            name={user.name}
            src={user.avatar || undefined}
            size="xl"
            className="border-4 border-surface shadow-md" />
          
          <div className="absolute bottom-1 right-1 bg-success text-white p-1 rounded-full border-2 border-surface">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="pt-12 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {user.name}
            </h1>
            <div className="flex items-center gap-1 text-text-secondary mt-1">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{user.location || 'Add location'}</span>
            </div>
          </div>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            Available
          </span>
        </div>

        <p className="mt-4 text-text-secondary text-sm leading-relaxed">
          {user.bio || 'Add a bio to tell employers about your skills and experience.'}
        </p>

        {/* Stats */}
        <div className="flex justify-between mt-6 p-4 bg-background rounded-2xl border border-border">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-primary mb-1">
              <ShieldIcon className="w-5 h-5" />
              <span className="font-bold text-lg">{user.trustScore}</span>
            </div>
            <span className="text-xs text-text-secondary">Trust Score</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <span className="font-bold text-lg text-text-primary mb-1">{user.completedJobs}</span>
            <span className="text-xs text-text-secondary">Jobs Done</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-secondary mb-1">
              <StarIcon className="w-5 h-5 fill-secondary" />
              <span className="font-bold text-lg">{user.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-text-secondary">Rating</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <ActionButton
            variant="outline"
            size="md"
            className="flex-1 border-border text-text-primary hover:bg-background"
            onClick={onEditProfile}>
            
            Edit Profile
          </ActionButton>
          <ActionButton
            variant="outline"
            size="md"
            className="flex-1 border-border text-text-primary hover:bg-background"
            onClick={onShareProfile}>
            
            Share Profile
          </ActionButton>
          <ActionButton
            variant="gradient"
            size="md"
            className="flex-1 shadow-md"
            onClick={onUploadVideo}>
            
            Add Video
          </ActionButton>
        </div>
      </div>

      {/* Impact Dashboard Quick Access */}
      <div
        className="bg-surface mt-2 p-5 border-y border-border shadow-sm cursor-pointer hover:bg-background transition-colors"
        onClick={onImpactDashboard}>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-1">
              <BarChart3Icon className="w-5 h-5 text-primary" /> Impact
              Dashboard
            </h2>
            <p className="text-xs text-text-secondary font-medium">
              View your economic impact and B-BBEE stats
            </p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
        </div>
      </div>

      {/* Wallet Quick Access */}
      <div
        className="bg-surface mt-2 p-5 border-y border-border shadow-sm cursor-pointer hover:bg-background transition-colors"
        onClick={onWallet}>
        
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-1">
              <WalletIcon className="w-5 h-5 text-secondary" /> Wallet
            </h2>
            <p className="text-xs text-text-secondary font-medium">
              Manage your earnings, payments and invoices
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-text-primary">
              {wallet?.formattedBalance || 'R0'}
            </span>
            <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Safety & Preferences */}
      <div className="bg-surface mt-2 p-5 border-y border-border shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 mb-1">
              👩‍🔧 Women in Trade Mode
              {safeMode &&
              <span className="bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Active
                </span>
              }
            </h2>
            <p className="text-xs text-text-secondary font-medium leading-relaxed">
              Match with verified female employers · Join safety group chats ·
              Female-only job listings
            </p>
            <p className="text-[10px] font-bold text-primary mt-2 flex items-center gap-1">
              <ShieldCheckIcon className="w-3 h-3" /> 2,400+ women in your area
            </p>
          </div>
          <button
            onClick={() => setSafeMode(!safeMode)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${safeMode ? 'bg-accent' : 'bg-border'}`}>
            
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${safeMode ? 'left-7' : 'left-1'}`} />
            
          </button>
        </div>
      </div>

      {/* Certifications Quick Access */}
      <div
        className="bg-surface mt-2 p-5 border-y border-border shadow-sm cursor-pointer hover:bg-background transition-colors"
        onClick={onCertifications}>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <AwardIcon className="w-5 h-5 text-secondary" /> Certifications
          </h2>
          <span className="text-xs font-bold text-primary flex items-center">
            View All <ChevronRightIcon className="w-4 h-4" />
          </span>
        </div>
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-primary flex items-center justify-center shadow-sm">
            <span className="text-2xl">🔧</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-secondary flex items-center justify-center shadow-sm">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-accent flex items-center justify-center shadow-sm">
            <span className="text-2xl">⭐</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-background border border-border border-dashed flex items-center justify-center">
            <span className="text-xs font-bold text-text-secondary">+2</span>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-surface mt-2 p-5 border-y border-border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">My Skills</h2>
          <button
            onClick={onAddSkill}
            className="text-primary text-sm font-semibold min-h-[44px] flex items-center">
            
            Add New
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {user.skills.length === 0 && (
            <p className="text-sm text-text-secondary">No skills added yet.</p>
          )}
          {user.skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between">
              <SkillTag name={skill.name} icon={skill.icon} level={skill.level} size="lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Videos */}
      <div className="bg-surface mt-2 p-4 border-y border-border">
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Portfolio Videos
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {myVideos.length === 0 && (
            <p className="col-span-2 text-sm text-text-secondary text-center py-4">
              No videos yet. Tap Add Video to showcase your skills.
            </p>
          )}
          {myVideos.map((video) => (
          <div
            key={video.id}
            className="relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden">
              <img
              src={video.thumbnail || 'https://picsum.photos/seed/video/400/600'}
              alt={video.title}
              className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                <StarIcon className="w-3 h-3 fill-white" /> {video.likes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-surface mt-2 p-4 border-y border-border pb-8">
        <h2 className="text-lg font-bold text-text-primary mb-4">Reviews</h2>
        {[
        {
          name: 'TechHub Ltd',
          rating: 5,
          text: 'Kwame fixed our plumbing issue quickly and professionally. Highly recommended!',
          date: '2 days ago'
        },
        {
          name: 'Grace Wanjiku',
          rating: 4,
          text: 'Great work on the engine repair. Very knowledgeable and fair pricing.',
          date: '1 week ago'
        }].
        map((review, i) =>
        <div
          key={i}
          className="mb-4 pb-4 border-b border-border last:border-0 last:mb-0 last:pb-0">
          
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <UserAvatar name={review.name} size="sm" />
                <span className="font-semibold text-sm text-text-primary">
                  {review.name}
                </span>
              </div>
              <span className="text-xs text-text-secondary">{review.date}</span>
            </div>
            <RatingStars rating={review.rating} size="sm" />
            <p className="text-sm text-text-secondary mt-2">{review.text}</p>
          </div>
        )}
      </div>
    </div>);

}