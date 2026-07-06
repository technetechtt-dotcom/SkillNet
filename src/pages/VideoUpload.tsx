import React, { useState } from 'react';
import { ArrowLeftIcon, VideoIcon, XIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
interface VideoUploadProps {
  onBack: () => void;
}
export function VideoUpload({ onBack }: VideoUploadProps) {
  const { token } = useAuth();
  const [hasVideo, setHasVideo] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const maxDesc = 200;
  const [error, setError] = useState('');
  const handlePost = async () => {
    if (!token) return;
    setIsPosting(true);
    setError('');
    try {
      await api.postVideo({ title, category, description }, token);
      setIsPosting(false);
      setPosted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not post video.');
      setIsPosting(false);
    }
  };
  if (posted) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Video Posted!
        </h2>
        <p className="text-text-secondary mb-8">
          Your skill video is now live and visible to employers and the
          community.
        </p>
        <ActionButton onClick={onBack} fullWidth={false} className="px-12">
          Back to Feed
        </ActionButton>
      </div>);

  }
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">

          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Upload Video</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Upload Area */}
        {!hasVideo ?
        <button
          onClick={() => setHasVideo(true)}
          className="w-full aspect-video bg-surface border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 mb-6 active:border-primary active:bg-primary/5 transition-colors">

            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <VideoIcon className="w-8 h-8 text-primary" />
            </div>
            <span className="text-text-primary font-semibold">
              Tap to upload video
            </span>
            <span className="text-xs text-text-secondary">
              MP4, MOV up to 100MB
            </span>
          </button> :

        <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6">
            <img
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            alt="Video preview"
            className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/30 backdrop-blur-sm rounded-full p-4">
                <VideoIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <button
            onClick={() => setHasVideo(false)}
            className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 min-h-[40px] min-w-[40px] flex items-center justify-center">

              <XIcon className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md">
              0:45
            </div>
          </div>
        }

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fixing a complex engine issue"
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base" />

          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Skill Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary focus:outline-none focus:border-primary text-base appearance-none">

              <option value="">Select a category</option>
              <option value="electrician">⚡ Electrician</option>
              <option value="mechanic">🔧 Mechanic</option>
              <option value="carpenter">🪚 Carpenter</option>
              <option value="plumber">🔨 Plumber</option>
              <option value="chef">👨‍🍳 Chef</option>
              <option value="hairdresser">💇 Hairdresser</option>
              <option value="farmer">🌾 Farmer</option>
              <option value="driver">🚗 Driver</option>
              <option value="painter">🎨 Painter</option>
              <option value="tailor">👔 Tailor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, maxDesc))}
              placeholder="Describe what you're doing in this video..."
              rows={3}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base resize-none" />

            <p className="text-xs text-text-secondary mt-1 text-right">
              {description.length}/{maxDesc}
            </p>
          </div>
        </div>

        <div className="mt-8 pb-6">
          {error && <p className="text-error text-sm mb-3">{error}</p>}
          <ActionButton
            onClick={handlePost}
            loading={isPosting}
            disabled={!hasVideo || !title || !category}>

            Post Video
          </ActionButton>
        </div>
      </div>
    </div>);

}