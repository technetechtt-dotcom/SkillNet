import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EyeIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { api, AdminStory, AdminVideo } from '../../lib/api';
import { ContentViewerModal } from '../components/ContentViewerModal';

type Tab = 'videos' | 'stories';

function ContentCard({
  preview,
  title,
  subtitle,
  meta,
  onView,
  onDelete,
}: {
  preview: string | null;
  title: string;
  subtitle: string;
  meta: string;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={onView}
        className="w-full aspect-video bg-background relative group">
        {preview ? (
          <img
            src={preview}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary text-sm">
            No preview
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
          <EyeIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>
      <div className="p-4">
        <h3 className="font-bold text-text-primary truncate">{title}</h3>
        <p className="text-sm text-text-secondary truncate">{subtitle}</p>
        <p className="text-xs text-text-secondary mt-1">{meta}</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onView}
            className="flex-1 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20">
            View
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl text-error hover:bg-error/10">
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterUserId = searchParams.get('userId') || '';
  const [tab, setTab] = useState<Tab>('videos');
  const [viewer, setViewer] = useState<
    | { kind: 'video'; data: AdminVideo }
    | { kind: 'story'; data: AdminStory }
    | null
  >(null);
  const queryClient = useQueryClient();

  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ['admin', 'videos', filterUserId],
    queryFn: () =>
      api.admin.videos.list(filterUserId ? { userId: filterUserId } : undefined),
    enabled: tab === 'videos',
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ['admin', 'stories', filterUserId],
    queryFn: () =>
      api.admin.stories.list(filterUserId ? { userId: filterUserId } : undefined),
    enabled: tab === 'stories',
  });

  const deleteVideo = useMutation({
    mutationFn: (id: string) => api.admin.videos.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'videos'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-content'] });
    },
  });

  const deleteStory = useMutation({
    mutationFn: (id: string) => api.admin.stories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user-content'] });
    },
  });

  const handleDelete = (id: string, kind: 'video' | 'story') => {
    if (kind === 'video') deleteVideo.mutate(id);
    else deleteStory.mutate(id);
  };

  const clearUserFilter = () => {
    searchParams.delete('userId');
    setSearchParams(searchParams);
  };

  const isLoading = tab === 'videos' ? videosLoading : storiesLoading;
  const items = tab === 'videos' ? videos : stories;

  return (
    <div>
      <h1 className="text-2xl font-black text-text-primary mb-1">Content</h1>
      <p className="text-text-secondary mb-6">
        View and moderate user videos and stories
      </p>

      {filterUserId && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold w-fit">
          Filtered by user
          <button
            onClick={clearUserFilter}
            className="p-1 rounded-lg hover:bg-primary/20">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {(['videos', 'stories'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${
              tab === t
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-text-secondary'
            }`}>
            {t} ({t === 'videos' ? videos.length : stories.length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-text-secondary">Loading content…</p>
      ) : items.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center text-text-secondary">
          No {tab} found
          {filterUserId ? ' for this user' : ''}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tab === 'videos' &&
            videos.map((v) => (
              <ContentCard
                key={v.id}
                preview={v.thumbnail || v.videoUrl}
                title={v.title}
                subtitle={`${v.userName || 'Unknown'}${v.status !== 'active' ? ` · ${v.status}` : ''}`}
                meta={`${v.likes} likes · ${new Date(v.createdAt).toLocaleDateString('en-ZA')}`}
                onView={() => setViewer({ kind: 'video', data: v })}
                onDelete={() => {
                  if (confirm('Delete this video?')) deleteVideo.mutate(v.id);
                }}
              />
            ))}

          {tab === 'stories' &&
            stories.map((s) => (
              <ContentCard
                key={s.id}
                preview={s.mediaUrl}
                title={s.text?.slice(0, 60) || '(media story)'}
                subtitle={s.userName || 'Unknown author'}
                meta={`${s.skillTag || 'No tag'} · expires ${new Date(s.expiresAt).toLocaleDateString('en-ZA')}`}
                onView={() => setViewer({ kind: 'story', data: s })}
                onDelete={() => {
                  if (confirm('Delete this story?')) deleteStory.mutate(s.id);
                }}
              />
            ))}
        </div>
      )}

      <ContentViewerModal
        item={viewer}
        onClose={() => setViewer(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
