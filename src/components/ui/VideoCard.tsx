import React, { useState } from 'react';
import {
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
  UserPlusIcon,
  PlayIcon,
  ColumnsIcon } from
'lucide-react';
import { Video } from '../../types';
import { UserAvatar } from './UserAvatar';
import { SkillTag } from './SkillTag';
import { formatCount } from '../../utils/format';
const REACTIONS = [
{
  emoji: '🔥',
  label: 'Fire Work'
},
{
  emoji: '💪',
  label: 'Skilled'
},
{
  emoji: '🏆',
  label: 'Hire This'
},
{
  emoji: '❤️',
  label: 'Love'
},
{
  emoji: '👏',
  label: 'Respect'
}];

interface VideoCardProps {
  video: Video;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
  onDuet?: () => void;
}
export function VideoCard({
  video,
  onLike,
  onComment,
  onShare,
  onFollow,
  onDuet
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const handleLike = () => {
    if (!activeReaction) {
      setIsLiked(!isLiked);
    }
    if (onLike) onLike();
  };
  const handleReaction = (emoji: string) => {
    if (activeReaction === emoji) {
      setActiveReaction(null);
      setIsLiked(false);
    } else {
      setActiveReaction(emoji);
      setIsLiked(true);
    }
    setShowReactions(false);
  };
  return (
    <div className="relative w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden mb-4 snap-center shadow-elevated group">
      {/* Video Thumbnail/Player */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}>
        
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-60' : 'opacity-100'}`} />
        
        {!isPlaying &&
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/10 transform group-hover:scale-110 transition-transform duration-300">
              <PlayIcon className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        }
      </div>

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none" />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
        <div className="relative mb-2">
          <UserAvatar
            src={video.user.avatar}
            name={video.user.name}
            size="md"
            className="ring-2 ring-white/50 shadow-lg" />
          
          <button
            onClick={onFollow}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform touch-target min-h-0 min-w-0"
            aria-label="Follow user">
            
            <UserPlusIcon className="w-3 h-3" strokeWidth={3} />
          </button>
        </div>

        {/* Like / Reaction Button */}
        <div className="relative">
          {/* Reaction Picker */}
          {showReactions &&
          <div className="absolute -left-48 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-xl rounded-2xl px-2 py-1.5 flex items-center gap-1 border border-white/20 shadow-lg z-20 animate-fade-in">
              {REACTIONS.map((r) =>
            <button
              key={r.emoji}
              onClick={() => handleReaction(r.emoji)}
              className={`text-xl p-1.5 rounded-xl hover:bg-white/20 transition-all hover:scale-125 active:scale-95 ${activeReaction === r.emoji ? 'bg-white/20 scale-110' : ''}`}
              title={r.label}>
              
                  {r.emoji}
                </button>
            )}
            </div>
          }

          <button
            onClick={handleLike}
            onDoubleClick={() => setShowReactions(!showReactions)}
            className="flex flex-col items-center gap-1.5 touch-target min-h-0 min-w-0 group/btn">
            
            <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 group-hover/btn:bg-black/40 transition-colors">
              {activeReaction ?
              <span className="text-xl leading-none block w-6 h-6 flex items-center justify-center">
                  {activeReaction}
                </span> :

              <HeartIcon
                className={`w-6 h-6 transition-transform group-hover/btn:scale-110 ${isLiked ? 'fill-error text-error' : 'text-white'}`} />

              }
            </div>
            <span className="text-white text-xs font-bold drop-shadow-md">
              {formatCount(video.likes + (isLiked ? 1 : 0))}
            </span>
          </button>
        </div>

        <button
          onClick={onComment}
          className="flex flex-col items-center gap-1.5 touch-target min-h-0 min-w-0 group/btn">
          
          <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 group-hover/btn:bg-black/40 transition-colors">
            <MessageCircleIcon className="w-6 h-6 text-white transition-transform group-hover/btn:scale-110" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">
            {formatCount(video.comments)}
          </span>
        </button>

        <button
          onClick={onShare}
          className="flex flex-col items-center gap-1.5 touch-target min-h-0 min-w-0 group/btn">
          
          <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 group-hover/btn:bg-black/40 transition-colors">
            <ShareIcon className="w-6 h-6 text-white transition-transform group-hover/btn:scale-110" />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md">
            {formatCount(video.shares)}
          </span>
        </button>

        {/* Duet Button */}
        {onDuet &&
        <button
          onClick={onDuet}
          className="flex flex-col items-center gap-1.5 touch-target min-h-0 min-w-0 group/btn">
          
            <div className="p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 group-hover/btn:bg-black/40 transition-colors">
              <ColumnsIcon className="w-6 h-6 text-white transition-transform group-hover/btn:scale-110" />
            </div>
            <span className="text-white text-xs font-bold drop-shadow-md">
              Duet
            </span>
          </button>
        }
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-5 left-4 right-16 z-10">
        <div className="flex items-center gap-2 mb-2.5">
          <h3 className="text-white font-bold text-lg drop-shadow-md">
            {video.user.name}
          </h3>
          <SkillTag
            name={video.skillCategory}
            size="sm"
            className="bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-sm" />
          
        </div>
        <p className="text-white/95 text-sm line-clamp-2 mb-3 drop-shadow-sm leading-snug">
          {video.description}
        </p>
        <div className="flex items-center gap-2.5 text-white/80 text-xs font-semibold">
          <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
            <PlayIcon className="w-3 h-3" /> {video.title}
          </span>
          <span className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
            {video.duration}
          </span>
        </div>
      </div>
    </div>);

}