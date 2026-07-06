import React, { useState } from 'react';
import { ArrowLeftIcon, CopyIcon, CheckIcon, DownloadIcon } from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { SkillTag } from '../components/ui/SkillTag';
import { RatingStars } from '../components/ui/RatingStars';
interface ShareProfileProps {
  onBack: () => void;
}
export function ShareProfile({ onBack }: ShareProfileProps) {
  const [copied, setCopied] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => setActiveToast(null), 2000);
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
        <h1 className="text-lg font-bold text-text-primary">Share Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Profile Card Preview */}
        <div className="bg-gradient-to-br from-primary via-teal-600 to-teal-800 rounded-3xl p-8 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <UserAvatar
              src="https://i.pravatar.cc/150?u=kwame"
              name="Kwame Mensah"
              size="xl"
              className="mx-auto mb-4 ring-4 ring-white/30 shadow-lg" />
            
            <h2 className="text-2xl font-black mb-1">Kwame Mensah</h2>
            <p className="text-white/80 text-sm mb-4">Accra, Ghana</p>

            <div className="flex justify-center gap-2 mb-6">
              <SkillTag
                name="Mechanic"
                icon="🔧"
                size="sm"
                className="bg-white/20 text-white border-white/30" />
              
              <SkillTag
                name="Driver"
                icon="🚗"
                size="sm"
                className="bg-white/20 text-white border-white/30" />
              
            </div>

            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-black">95</p>
                <p className="text-xs text-white/70 uppercase tracking-wider">
                  Trust Score
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black">42</p>
                <p className="text-xs text-white/70 uppercase tracking-wider">
                  Jobs Done
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-2xl font-black">4.8</span>
                </div>
                <p className="text-xs text-white/70 uppercase tracking-wider">
                  Rating
                </p>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-white rounded-2xl p-4 mb-4 mx-auto w-32 h-32 flex items-center justify-center">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                  'linear-gradient(#0D9488 2px, transparent 2px), linear-gradient(90deg, #0D9488 2px, transparent 2px)',
                  backgroundSize: '8px 8px'
                }} />
              
            </div>

            <p className="text-sm font-mono bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg inline-block">
              skillnet.africa/kwame-mensah
            </p>
          </div>
        </div>

        {/* Link Section */}
        <div>
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
            Profile Link
          </h3>
          <div className="flex gap-2">
            <div className="flex-1 bg-surface border border-border rounded-2xl px-4 py-3 text-sm font-mono text-text-primary truncate">
              skillnet.africa/kwame-mensah
            </div>
            <button
              onClick={handleCopy}
              className="bg-primary text-white px-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-primary-dark transition-colors shadow-sm">
              
              {copied ?
              <>
                  <CheckIcon className="w-4 h-4" /> Copied
                </> :

              <>
                  <CopyIcon className="w-4 h-4" /> Copy
                </>
              }
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div>
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
            Share To
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => showToast('📱 Opening WhatsApp...')}
              className="w-full bg-[#25D366] text-white rounded-2xl p-4 font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-sm">
              
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor">
                
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Share on WhatsApp
            </button>

            <button
              onClick={() => showToast('📘 Opening Facebook...')}
              className="w-full bg-[#1877F2] text-white rounded-2xl p-4 font-bold flex items-center justify-center gap-2 hover:bg-[#166FE5] transition-colors shadow-sm">
              
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor">
                
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share on Facebook
            </button>

            <button
              onClick={() => showToast('🐦 Opening Twitter...')}
              className="w-full bg-black text-white rounded-2xl p-4 font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-sm">
              
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor">
                
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>

            <button
              onClick={() => showToast('💾 Downloading card...')}
              className="w-full bg-surface border border-border text-text-primary rounded-2xl p-4 font-bold flex items-center justify-center gap-2 hover:bg-background transition-colors shadow-sm">
              
              <DownloadIcon className="w-5 h-5" />
              Download Card
            </button>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>);

}