import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, XIcon } from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ActionButton } from '../components/ui/ActionButton';
import { api, ApiStory } from '../lib/api';

interface StoriesProps {
  onBack: () => void;
  onProfileClick: (workerId: string) => void;
}

export function Stories({ onBack, onProfileClick }: StoriesProps) {
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: () => api.stories.list(),
  });

  const allStories: ApiStory[] = useMemo(
    () => groups.flatMap((g) => g.stories),
    [groups]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const currentStory = allStories[currentIndex];

  useEffect(() => {
    if (!allStories.length) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (currentIndex < allStories.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            onBack();
          }
          return 0;
        }
        return prev + 100 / 30;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex, onBack, allStories.length]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-black items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="flex flex-col h-full bg-black items-center justify-center p-8 text-center text-white">
        <p className="mb-4">No stories available right now.</p>
        <ActionButton onClick={onBack} fullWidth={false} className="px-8">
          Go Back
        </ActionButton>
      </div>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < allStories.length - 1) setCurrentIndex(currentIndex + 1);
    else onBack();
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-3 pt-4">
        {allStories.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="absolute top-12 right-4 z-30 text-white p-2 rounded-full bg-black/40">
        <XIcon className="w-6 h-6" />
      </button>

      <div className="absolute inset-0">
        <img src={currentStory.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <div className="absolute top-16 left-4 z-30 flex items-center gap-3">
        <button onClick={() => onProfileClick(currentStory.userId)}>
          <UserAvatar
            src={currentStory.userAvatar || undefined}
            name={currentStory.userName}
            size="md"
          />
        </button>
        <div>
          <p className="text-white font-bold text-sm">{currentStory.userName}</p>
          <p className="text-white/70 text-xs">
            {currentStory.skill} · {currentStory.timestamp}
          </p>
        </div>
      </div>

      <div className="absolute bottom-24 left-4 right-4 z-30">
        <p className="text-white text-lg font-medium">{currentStory.text}</p>
      </div>

      <div className="absolute inset-0 flex z-20">
        <button className="flex-1" onClick={handlePrevious} aria-label="Previous" />
        <button className="flex-1" onClick={handleNext} aria-label="Next" />
      </div>

      <div className="absolute bottom-6 left-4 right-4 z-30">
        <ActionButton
          onClick={() => onProfileClick(currentStory.userId)}
          variant="gradient"
          className="shadow-lg">
          View Profile
        </ActionButton>
      </div>
    </div>
  );
}
