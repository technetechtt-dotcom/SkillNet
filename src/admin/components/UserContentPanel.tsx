import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { EyeIcon, FilmIcon, XIcon } from 'lucide-react';
import { api, AdminUser } from '../../lib/api';
import { ContentViewerModal } from './ContentViewerModal';

interface UserContentPanelProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function UserContentPanel({ user, onClose }: UserContentPanelProps) {
  const [viewer, setViewer] = useState<
    | { kind: 'video'; data: import('../../lib/api').AdminVideo }
    | { kind: 'story'; data: import('../../lib/api').AdminStory }
    | null
  >(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'user-content', user?.id],
    queryFn: () => api.admin.users.content(user!.id),
    enabled: !!user,
  });

  if (!user) return null;

  const videos = data?.videos ?? [];
  const stories = data?.stories ?? [];

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex justify-end bg-black/40"
        onClick={onClose}>
        <div
          className="w-full max-w-lg h-full bg-surface border-l border-border shadow-elevated overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="font-bold text-text-primary">{user.name}</h2>
              <p className="text-sm text-text-secondary">{user.phone}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <Link
              to={`/admin/content?userId=${user.id}`}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <FilmIcon className="w-4 h-4" />
              Open full content view
            </Link>

            {isLoading ? (
              <p className="text-text-secondary">Loading content…</p>
            ) : (
              <>
                <section>
                  <h3 className="font-bold text-text-primary mb-3">
                    Videos ({videos.length})
                  </h3>
                  {videos.length === 0 ? (
                    <p className="text-sm text-text-secondary">No videos</p>
                  ) : (
                    <div className="space-y-3">
                      {videos.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setViewer({ kind: 'video', data: v })}
                          className="w-full flex gap-3 p-3 rounded-xl border border-border hover:border-primary/50 text-left transition-colors">
                          <div className="w-20 h-14 rounded-lg bg-background overflow-hidden flex-shrink-0">
                            {v.thumbnail || v.videoUrl ? (
                              <img
                                src={v.thumbnail || v.videoUrl || ''}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-text-secondary">
                                —
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {v.title}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {v.likes} likes ·{' '}
                              {new Date(v.createdAt).toLocaleDateString('en-ZA')}
                            </p>
                          </div>
                          <EyeIcon className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="font-bold text-text-primary mb-3">
                    Stories ({stories.length})
                  </h3>
                  {stories.length === 0 ? (
                    <p className="text-sm text-text-secondary">No stories</p>
                  ) : (
                    <div className="space-y-3">
                      {stories.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setViewer({ kind: 'story', data: s })}
                          className="w-full flex gap-3 p-3 rounded-xl border border-border hover:border-primary/50 text-left transition-colors">
                          <div className="w-20 h-14 rounded-lg bg-background overflow-hidden flex-shrink-0">
                            {s.mediaUrl ? (
                              <img
                                src={s.mediaUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-text-secondary">
                                —
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {s.text || '(media story)'}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {s.skillTag || 'No tag'}
                            </p>
                          </div>
                          <EyeIcon className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      <ContentViewerModal item={viewer} onClose={() => setViewer(null)} />
    </>
  );
}
