import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function EngagementPanel({ videoId }: { videoId: string }) {
  const [tab, setTab] = useState<'likes' | 'comments' | 'shares'>('likes');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'engagement', videoId],
    queryFn: () => api.admin.videos.engagement(videoId),
  });

  if (isLoading) return <p className="text-sm text-text-secondary">Loading engagement…</p>;
  if (!data) return null;

  const tabs = [
    { key: 'likes' as const, label: `Reactions (${data.likes.length})` },
    { key: 'comments' as const, label: `Comments (${data.comments.length})` },
    { key: 'shares' as const, label: `Shares (${data.shares.length})` },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              tab === t.key
                ? 'bg-primary text-white'
                : 'bg-background border border-border text-text-secondary'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {tab === 'likes' &&
          (data.likes.length === 0 ? (
            <p className="text-sm text-text-secondary">No reactions yet</p>
          ) : (
            data.likes.map((l) => (
              <div
                key={`${l.userId}-${l.createdAt}`}
                className="flex items-center gap-3 p-2 rounded-xl bg-background">
                {l.userAvatar ? (
                  <img src={l.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{l.userName}</p>
                  <p className="text-xs text-text-secondary">
                    {l.reaction} · {new Date(l.createdAt).toLocaleString('en-ZA')}
                  </p>
                </div>
              </div>
            ))
          ))}

        {tab === 'comments' &&
          (data.comments.length === 0 ? (
            <p className="text-sm text-text-secondary">No comments yet</p>
          ) : (
            data.comments.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-xl bg-background ${c.status !== 'active' ? 'opacity-60 border border-error/30' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold">{c.userName}</p>
                  {c.status !== 'active' && (
                    <span className="text-xs text-error font-bold uppercase">
                      {c.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-primary">{c.text}</p>
                <p className="text-xs text-text-secondary mt-1">
                  {new Date(c.createdAt).toLocaleString('en-ZA')}
                </p>
              </div>
            ))
          ))}

        {tab === 'shares' &&
          (data.shares.length === 0 ? (
            <p className="text-sm text-text-secondary">No shares yet</p>
          ) : (
            data.shares.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-2 rounded-xl bg-background">
                {s.userAvatar ? (
                  <img src={s.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20" />
                )}
                <div>
                  <p className="text-sm font-semibold">{s.userName}</p>
                  <p className="text-xs text-text-secondary">
                    Shared {new Date(s.createdAt).toLocaleString('en-ZA')}
                  </p>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}
