import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  VideoIcon,
  XIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { SkillTag } from '../components/ui/SkillTag';
interface VideoUploadProps {
  onBack: () => void;
}
export function VideoUpload({ onBack }: VideoUploadProps) {
  const [hasVideo, setHasVideo] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const maxDesc = 200;
  const handleVideoSelect = () => {
    setHasVideo(true);
    setIsScanning(true);
    // Simulate AI scanning
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      // Auto-fill based on AI
      setCategory('plumber');
      setTitle('Fixing a leaking PVC pipe');
    }, 2500);
  };
  const handleAcceptScan = () => {
    setScanComplete(false);
  };
  const handlePost = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setPosted(true);
    }, 1500);
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
          onClick={handleVideoSelect}
          className="w-full aspect-video bg-surface border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 mb-6 hover:border-primary hover:bg-primary/5 transition-colors shadow-sm">
          
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <VideoIcon className="w-8 h-8 text-primary" />
            </div>
            <span className="text-text-primary font-bold">
              Tap to upload video
            </span>
            <span className="text-xs text-text-secondary font-medium">
              MP4, MOV up to 100MB
            </span>
          </button> :

        <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6 shadow-md">
            <img
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            alt="Video preview"
            className={`w-full h-full object-cover transition-all duration-500 ${isScanning ? 'opacity-40 scale-105 blur-sm' : 'opacity-100'}`} />
          

            {/* Scanning Overlay */}
            {isScanning &&
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="w-16 h-16 bg-accent/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 animate-pulse border border-accent/50 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <SparklesIcon className="w-8 h-8 text-accent animate-spin-slow" />
                </div>
                <p className="text-white font-bold text-sm drop-shadow-md flex items-center gap-1">
                  SkillScan AI analyzing
                  <span className="animate-pulse">...</span>
                </p>
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
          }

            {/* Normal Controls Overlay */}
            {!isScanning && !scanComplete &&
          <>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-4">
                    <VideoIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <button
              onClick={() => setHasVideo(false)}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 min-h-[40px] min-w-[40px] flex items-center justify-center hover:bg-black/70 transition-colors">
              
                  <XIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                  0:45
                </div>
              </>
          }
          </div>
        }

        {/* AI Results Panel */}
        {scanComplete &&
        <div className="bg-gradient-to-br from-accent/10 to-primary/5 border border-accent/20 rounded-3xl p-5 mb-6 shadow-glow animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent text-white p-1.5 rounded-lg shadow-sm">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <h3 className="font-black text-text-primary text-lg">
                AI Detection Complete
              </h3>
            </div>

            <div className="bg-surface rounded-2xl p-4 shadow-sm border border-border mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Detected Skill
                  </p>
                  <p className="font-bold text-text-primary text-base">
                    Plumbing — Pipe Repair
                  </p>
                </div>
                <div className="bg-success/10 text-success px-2 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  <span className="text-[10px] font-bold">94% Match</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Suggested Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  <SkillTag
                  name="Plumber"
                  size="sm"
                  className="bg-accent/10 text-accent-dark border-none" />
                
                  <SkillTag
                  name="Pipe Fitting"
                  size="sm"
                  className="bg-accent/10 text-accent-dark border-none" />
                
                  <SkillTag
                  name="PVC Repair"
                  size="sm"
                  className="bg-accent/10 text-accent-dark border-none" />
                
                </div>
              </div>

              <div className="flex items-center gap-2 bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                <ShieldCheckIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary-dark">
                  +5 Trust Score for verified skill video
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
              onClick={() => setHasVideo(false)}
              className="flex-1 py-3 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
              
                Scan Again
              </button>
              <ActionButton
              onClick={handleAcceptScan}
              size="md"
              variant="gradient"
              className="flex-1 shadow-md">
              
                Accept & Continue
              </ActionButton>
            </div>
          </div>
        }

        {/* Form Fields */}
        {!isScanning && !scanComplete &&
        <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">
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
              <label className="flex items-center justify-between text-sm font-bold text-text-primary mb-2">
                <span>Skill Category</span>
                {category === 'plumber' &&
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-md flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3" /> AI Auto-filled
                  </span>
              }
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
              onChange={(e) =>
              setDescription(e.target.value.slice(0, maxDesc))
              }
              placeholder="Describe what you're doing in this video..."
              rows={3}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base resize-none" />
            
              <p className="text-xs text-text-secondary mt-1 text-right">
                {description.length}/{maxDesc}
              </p>
            </div>
          </div>
        }

        {!isScanning && !scanComplete &&
        <div className="mt-8 pb-6">
            <ActionButton
            onClick={handlePost}
            loading={isPosting}
            disabled={!hasVideo || !title || !category}
            variant="gradient">
            
              Post Video
            </ActionButton>
          </div>
        }
      </div>
    </div>);

}