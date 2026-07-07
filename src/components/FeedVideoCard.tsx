import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../lib/api';
import { Video } from '../types';
import { VideoCard } from './ui/VideoCard';

interface FeedVideoCardProps {
  video: Video;
  onDuet?: () => void;
}

export function FeedVideoCard({ video, onDuet }: FeedVideoCardProps) {
  const queryClient = useQueryClient();
  const [followed, setFollowed] = useState(false);

  const invalidateVideos = () => {
    queryClient.invalidateQueries({ queryKey: ['videos'] });
  };

  const likeMutation = useMutation({
    mutationFn: (reaction: string) => api.videos.like(video.id, reaction),
    onSuccess: invalidateVideos,
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => api.videos.comment(video.id, text),
    onSuccess: invalidateVideos,
  });

  const shareMutation = useMutation({
    mutationFn: () => api.videos.share(video.id),
    onSuccess: () => {
      invalidateVideos();
      if (typeof navigator.share === 'function') {
        navigator
          .share({ title: video.title, url: window.location.href })
          .catch(() => {});
      }
    },
  });

  const followMutation = useMutation({
    mutationFn: () =>
      followed
        ? api.users.unfollow(video.user.id)
        : api.users.follow(video.user.id),
    onSuccess: (data) => {
      setFollowed(data.following);
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });

  const handleComment = () => {
    const text = window.prompt('Add a comment');
    if (text?.trim()) {
      commentMutation.mutate(text.trim());
    }
  };

  return (
    <VideoCard
      video={video}
      onDuet={onDuet}
      onLike={() => likeMutation.mutate('like')}
      onReaction={(emoji) => likeMutation.mutate(emoji)}
      onComment={handleComment}
      onShare={() => shareMutation.mutate()}
      onFollow={() => followMutation.mutate()}
    />
  );
}
