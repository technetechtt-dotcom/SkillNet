import React, { useState } from 'react';
import { XIcon, Trash2Icon, ExternalLinkIcon, BanIcon, ShieldOffIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminStory, AdminVideo, api } from '../../lib/api';
import { EngagementPanel } from './EngagementPanel';

type ContentItem =
  | { kind: 'video'; data: AdminVideo }
  | { kind: 'story'; data: AdminStory };

interface ContentViewerModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onDelete?: (id: string, kind: 'video' | 'story') => void;
}

function MediaPreview({ item }: { item: ContentItem }) {
  if (item.kind === 'video') {
    const { videoUrl, thumbnail, title } = item.data;
    if (videoUrl) {
      return (
        <video
          src={videoUrl}
          controls
          playsInline
          poster={thumbnail || undefined}
          className="w-full max-h-[50vh] rounded-xl bg-black object-contain"
        />
      );
    }
    if (thumbnail) {
      return (
        <img
          src={thumbnail}
          alt={title}
          className="w-full max-h-[50vh] rounded-xl object-contain bg-black"
        />
      );
    }
    return (
      <div className="w-full aspect-video rounded-xl bg-background flex items-center justify-center text-text-secondary">
        No media available
      </div>
    );
  }

  const { mediaUrl, mediaType, text } = item.data;
  if (mediaType === 'video' && mediaUrl) {
    return (
      <video
        src={mediaUrl}
        controls
        playsInline
        className="w-full max-h-[50vh] rounded-xl bg-black object-contain"
      />
    );
  }
  if (mediaUrl) {
    return (
      <img
        src={mediaUrl}
        alt={text || 'Story'}
        className="w-full max-h-[50vh] rounded-xl object-contain bg-black"
      />
    );
  }
  return (
    <div className="w-full aspect-video rounded-xl bg-background flex items-center justify-center text-text-secondary">
      No media available
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === 'active'
      ? 'bg-success/10 text-success'
      : status === 'blocked'
        ? 'bg-warning/10 text-warning'
        : 'bg-error/10 text-error';
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${colors}`}>
      {status}
    </span>
  );
}

export function ContentViewerModal({
  item,
  onClose,
  onDelete,
}: ContentViewerModalProps) {
  const queryClient = useQueryClient();
  const [panel, setPanel] = useState<'preview' | 'engagement'>('preview');
  const [blockReason, setBlockReason] = useState('Violates platform rules');

  const moderateVideo = useMutation({
    mutationFn: (status: 'active' | 'blocked' | 'removed') =>
      api.admin.videos.moderate(item!.data.id, { status, reason: blockReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'videos'] });
      onClose();
    },
  });

  const moderateStory = useMutation({
    mutationFn: (status: 'active' | 'blocked' | 'removed') =>
      api.admin.stories.moderate(item!.data.id, { status, reason: blockReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
      onClose();
    },
  });

  if (!item) return null;

  const isVideo = item.kind === 'video';
  const data = item.data;
  const mediaUrl = isVideo ? data.videoUrl : data.mediaUrl;
  const status = data.status || 'active';

  const handleModerate = (action: 'blocked' | 'removed' | 'active') => {
    if (isVideo) moderateVideo.mutate(action);
    else moderateStory.mutate(action);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}>
      <div
        className="bg-surface rounded-2xl border border-border shadow-elevated w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-text-primary">
                {isVideo ? data.title : 'Story'}
              </h2>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-text-secondary">
              by {data.userName || 'Unknown'} ·{' '}
              {new Date(data.createdAt).toLocaleString('en-ZA')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-background">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {isVideo && (
          <div className="flex border-b border-border px-6">
            {(['preview', 'engagement'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPanel(p)}
                className={`px-4 py-3 text-sm font-bold capitalize border-b-2 -mb-px ${
                  panel === p
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary'
                }`}>
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-4">
          {panel === 'preview' && (
            <>
              <MediaPreview item={item} />
              {!isVideo && data.text && (
                <p className="text-text-primary whitespace-pre-wrap">{data.text}</p>
              )}
              {isVideo && data.description && (
                <p className="text-text-secondary">{data.description}</p>
              )}
              {'moderationReason' in data && data.moderationReason && (
                <p className="text-sm bg-warning/10 text-warning px-4 py-2 rounded-xl">
                  Moderation note: {data.moderationReason}
                </p>
              )}
            </>
          )}

          {panel === 'engagement' && isVideo && (
            <EngagementPanel videoId={data.id} />
          )}

          <div className="border-t border-border pt-4 space-y-3">
            <input
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Moderation reason (optional)"
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {mediaUrl && (
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-background">
                  <ExternalLinkIcon className="w-4 h-4" />
                  Open media
                </a>
              )}
              {status !== 'blocked' && (
                <button
                  onClick={() => {
                    if (confirm('Block this content? It will be hidden from users.')) {
                      handleModerate('blocked');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning text-sm font-semibold">
                  <BanIcon className="w-4 h-4" />
                  Block
                </button>
              )}
              {status !== 'active' && (
                <button
                  onClick={() => handleModerate('active')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-semibold">
                  <ShieldOffIcon className="w-4 h-4" />
                  Restore
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm('Permanently remove this content?')) {
                      handleModerate('removed');
                      onDelete(data.id, item.kind);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 text-error text-sm font-semibold">
                  <Trash2Icon className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
