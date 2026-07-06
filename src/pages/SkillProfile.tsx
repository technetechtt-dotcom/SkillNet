import React, { useEffect, useState } from 'react';
import {
  MapPinIcon,
  ShieldIcon,
  StarIcon,
  SettingsIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { SkillTag } from '../components/ui/SkillTag';
import { ActionButton } from '../components/ui/ActionButton';
import { RatingStars } from '../components/ui/RatingStars';
import { User, Video } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
interface SkillProfileProps {
  onEditProfile?: () => void;
  onAddSkill?: () => void;
  onUploadVideo?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}
export function SkillProfile({
  onEditProfile,
  onAddSkill,
  onUploadVideo,
  onToggleTheme,
  isDark
}: SkillProfileProps) {
  const { token, signOut } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    if (!token) return;
    api.me(token).then(setProfile).catch(() => setProfile(null));
    api.feedVideos().then(setVideos).catch(() => setVideos([]));
  }, [token]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Cover & Avatar */}
      <div className="relative h-40 bg-gradient-to-br from-primary via-primary-dark to-secondary flex-shrink-0">
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
          <button className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 relative pb-6 bg-surface border-b border-border">
        <div className="absolute -top-12 left-4">
          <UserAvatar
            name={profile?.name || 'User'}
            src={profile?.avatar}
            size="xl"
            className="border-4 border-surface shadow-md" />

          <div className="absolute bottom-1 right-1 bg-success text-white p-1 rounded-full border-2 border-surface">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="pt-12 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {profile?.name || 'Loading...'}
            </h1>
            <div className="flex items-center gap-1 text-text-secondary mt-1">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{profile?.location || '-'}</span>
            </div>
          </div>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            Available
          </span>
        </div>

        <p className="mt-4 text-text-secondary text-sm leading-relaxed">
          {profile?.bio || 'Update your profile bio to help employers know you better.'}
        </p>

        {/* Stats */}
        <div className="flex justify-between mt-6 p-4 bg-background rounded-2xl border border-border">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-primary mb-1">
              <ShieldIcon className="w-5 h-5" />
              <span className="font-bold text-lg">{profile?.trustScore || 0}</span>
            </div>
            <span className="text-xs text-text-secondary">Trust Score</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <span className="font-bold text-lg text-text-primary mb-1">
              {profile?.completedJobs || 0}
            </span>
            <span className="text-xs text-text-secondary">Jobs Done</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-secondary mb-1">
              <StarIcon className="w-5 h-5 fill-secondary" />
              <span className="font-bold text-lg">{profile?.rating || 0}</span>
            </div>
            <span className="text-xs text-text-secondary">Rating</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <ActionButton
            variant="primary"
            size="md"
            className="flex-1"
            onClick={onEditProfile || signOut}>

            {onEditProfile ? 'Edit Profile' : 'Sign Out'}
          </ActionButton>
          <ActionButton
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onUploadVideo}>

            Add Video
          </ActionButton>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-surface mt-2 p-4 border-y border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">My Skills</h2>
          <button
            onClick={onAddSkill}
            className="text-primary text-sm font-semibold min-h-[44px] flex items-center">

            Add New
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(profile?.skills || []).map((skill) => (
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

      {/* Portfolio Videos */}
      <div className="bg-surface mt-2 p-4 border-y border-border">
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Portfolio Videos
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {videos.slice(0, 4).map((video, i) =>
          <div
            key={i}
            className="relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden">

              <img
              src={video.thumbnail}
              alt={`Portfolio ${i + 1}`}
              className="w-full h-full object-cover" />

              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                <StarIcon className="w-3 h-3 fill-white" />{' '}
                {(video.likes / 1000).toFixed(1)}k
              </div>
            </div>
          )}
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