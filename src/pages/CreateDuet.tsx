import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  CameraIcon,
  VideoIcon,
  MicIcon,
  PlayIcon,
  CheckCircleIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { UserAvatar } from '../components/ui/UserAvatar';
interface CreateDuetProps {
  onBack: () => void;
}
export function CreateDuet({ onBack }: CreateDuetProps) {
  const [duetType, setDuetType] = useState('reaction');
  const [isRecording, setIsRecording] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const handleRecord = () => {
    setActiveToast('🔴 Recording started...');
    setIsRecording(true);
    setTimeout(() => {
      setActiveToast('✅ Recording saved!');
      setIsRecording(false);
    }, 3000);
  };
  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Toast */}
      {activeToast &&
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-surface border border-border text-text-primary px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold animate-fade-in">
          {activeToast}
        </div>
      }

      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Create Duet</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Split Screen Preview */}
        <div className="flex gap-2 h-64 rounded-3xl overflow-hidden shadow-elevated bg-black">
          {/* Original Video */}
          <div className="flex-1 relative">
            <img
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Original video"
              className="w-full h-full object-cover opacity-80" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon className="w-8 h-8 text-white/50" />
            </div>
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white">
              Original
            </div>
          </div>

          {/* Camera Preview */}
          <div className="flex-1 relative bg-gray-900 flex flex-col items-center justify-center border-l-2 border-primary/50">
            {isRecording ?
            <>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse" />{' '}
                  REC
                </div>
                <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Camera feed"
                className="w-full h-full object-cover" />
              
              </> :

            <>
                <CameraIcon className="w-8 h-8 text-white/30 mb-2" />
                <span className="text-white/50 text-xs font-bold">
                  Your Camera
                </span>
              </>
            }
          </div>
        </div>

        {/* Original Creator Info */}
        <div className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3 shadow-sm">
          <UserAvatar
            src="https://i.pravatar.cc/150?u=kwame"
            name="Kwame Mensah"
            size="md" />
          
          <div>
            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
              Duetting with
            </p>
            <h3 className="font-bold text-text-primary">Kwame Mensah</h3>
            <p className="text-xs text-text-secondary">
              Mechanic · Fixing a complex engine issue
            </p>
          </div>
        </div>

        {/* Duet Type Selector */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">
            Duet Format
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDuetType('reaction')}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${duetType === 'reaction' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
              
              <span className="text-xl mb-1 block">😲</span>
              <span className="font-bold text-sm text-text-primary block">
                Reaction
              </span>
              <span className="text-[10px] text-text-secondary">
                Side-by-side
              </span>
            </button>
            <button
              onClick={() => setDuetType('apprentice')}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${duetType === 'apprentice' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
              
              <span className="text-xl mb-1 block">👨‍🏫</span>
              <span className="font-bold text-sm text-text-primary block">
                Apprentice
              </span>
              <span className="text-[10px] text-text-secondary">
                Learn & repeat
              </span>
            </button>
            <button
              onClick={() => setDuetType('beforeafter')}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${duetType === 'beforeafter' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
              
              <span className="text-xl mb-1 block">✨</span>
              <span className="font-bold text-sm text-text-primary block">
                Before & After
              </span>
              <span className="text-[10px] text-text-secondary">
                Show your result
              </span>
            </button>
            <button
              onClick={() => setDuetType('challenge')}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${duetType === 'challenge' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
              
              <span className="text-xl mb-1 block">🏆</span>
              <span className="font-bold text-sm text-text-primary block">
                Challenge
              </span>
              <span className="text-[10px] text-text-secondary">
                Beat their time
              </span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2 flex items-center gap-2">
            💡 Duet Tips
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1.5 pl-5 list-disc">
            <li>Ensure good lighting so your work is visible</li>
            <li>Use a tripod or prop your phone up for stability</li>
            <li>Speak clearly if you're explaining your process</li>
          </ul>
        </div>

        <div className="h-4" />
      </div>

      {/* Bottom Action */}
      <div className="p-4 bg-surface border-t border-border flex-shrink-0 flex gap-3">
        <button
          onClick={() => {
            setActiveToast('🎙️ Microphone enabled');
            setTimeout(() => setActiveToast(null), 2000);
          }}
          className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors shadow-sm">
          
          <MicIcon className="w-6 h-6" />
        </button>
        <ActionButton
          onClick={handleRecord}
          variant="gradient"
          className="flex-1 shadow-lg"
          disabled={isRecording}>
          
          {isRecording ? 'Recording...' : 'Start Recording'}
        </ActionButton>
      </div>
    </div>);

}