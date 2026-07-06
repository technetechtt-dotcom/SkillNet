import React, { useEffect, useState } from 'react';
import { BellIcon, SearchIcon, PlusIcon, FlameIcon } from 'lucide-react';
import { VideoCard } from '../components/ui/VideoCard';
import { Video } from '../types';
import { api } from '../services/api';

interface HomeFeedProps {
  onUploadVideo: () => void;
  onNotifications?: () => void;
}

export function HomeFeed({ onUploadVideo, onNotifications }: HomeFeedProps) {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following' | 'trending'>('foryou');
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    setIsLoading(true);
    setError('');
    const isFirstPage = page === 1;
    if (!isFirstPage) {
      setIsLoadingMore(true);
    }
    api.feedVideos(activeTab, { page, pageSize: 4 })
      .then((data) => {
        setHasNextPage(data.hasNextPage);
        setVideos((prev) => (isFirstPage ? data.items : [...prev, ...data.items]));
      })
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : 'Failed to load feed.')
      )
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  }, [activeTab, page]);

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex items-center justify-between px-4 py-3 bg-surface/95 backdrop-blur-md z-20 flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-teal-500 rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-white text-sm font-black tracking-tighter">SN</span>
          </div>
          <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary tracking-tight">
            SkillNet
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-text-secondary hover:text-primary transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-surface">
            <SearchIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onNotifications}
            className="p-2 text-text-secondary hover:text-primary transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center relative rounded-full hover:bg-surface"
          >
            <BellIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex px-4 pt-2 gap-6 border-b border-border bg-surface z-10 flex-shrink-0">
        {[
          { id: 'foryou', label: 'For You' },
          { id: 'following', label: 'Following' },
          { id: 'trending', label: 'Trending' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'foryou' | 'following' | 'trending')}
            className={`pb-3 px-1 font-bold transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab.label}
            {tab.id === 'trending' && (
              <FlameIcon
                className={`w-3.5 h-3.5 inline-block ml-1 -mt-0.5 ${activeTab === tab.id ? 'text-secondary' : 'text-text-secondary'}`}
              />
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(13,148,136,0.5)]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
        {isLoading && <p className="text-text-secondary">Loading feed...</p>}
        {error && <p className="text-error">{error}</p>}
        {!isLoading &&
          !error &&
          videos.map((video) => <VideoCard key={video.id} video={video} />)}
        {!isLoading && !error && hasNextPage && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoadingMore}
            className="w-full py-3 rounded-xl border border-border text-text-primary hover:bg-surface disabled:opacity-60"
          >
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </button>
        )}
      </div>

      <button
        onClick={onUploadVideo}
        className="absolute bottom-5 right-5 w-14 h-14 bg-gradient-to-r from-primary to-teal-500 text-white rounded-2xl shadow-elevated flex items-center justify-center active:scale-90 transition-transform z-30 border border-white/20"
        aria-label="Upload Video"
      >
        <PlusIcon className="w-7 h-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}