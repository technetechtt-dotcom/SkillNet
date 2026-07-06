import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  LockIcon,
  ExternalLinkIcon,
  Share2Icon } from
'lucide-react';
import { ContentCard } from '../components/ui/ContentCard';
interface CertificationsProps {
  onBack: () => void;
}
export function Certifications({ onBack }: CertificationsProps) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedId, setVerifiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setVerifyingId(null);
      setVerifiedId(id);
    }, 1500);
  };
  const handleShare = (id: string) => {
    setSharedId(id);
    setTimeout(() => setSharedId(null), 2000);
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              My Certifications{' '}
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
            </h1>
            <p className="text-xs text-text-secondary font-medium">
              Verified on-chain credentials
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Stats Row */}
        <div className="flex justify-between items-center bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <div className="text-center flex-1 border-r border-border">
            <p className="text-2xl font-black text-primary">3</p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Earned
            </p>
          </div>
          <div className="text-center flex-1 border-r border-border">
            <p className="text-2xl font-black text-secondary">2</p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              In Progress
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-black text-text-secondary">5</p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Available
            </p>
          </div>
        </div>

        {/* Earned Badges */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Earned Badges
          </h2>
          <div className="space-y-4">
            {/* Badge 1 */}
            <ContentCard className="relative overflow-hidden border-primary/30 shadow-glow group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-primary flex items-center justify-center shadow-lg flex-shrink-0 transform group-hover:scale-105 transition-transform">
                  <span className="text-3xl">🔧</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-text-primary flex items-center gap-1.5">
                    Certified Pipe Master
                    <ShieldCheckIcon className="w-4 h-4 text-primary" />
                  </h3>
                  <p className="text-sm text-text-secondary font-medium mt-1">
                    Completed 5 plumbing jobs with 4.5+ rating.
                  </p>
                  <p className="text-xs text-primary font-bold mt-2">
                    Earned March 2026
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between relative z-10">
                <button
                  onClick={() => handleVerify('b1')}
                  disabled={verifyingId === 'b1' || verifiedId === 'b1'}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${verifiedId === 'b1' ? 'text-success' : 'text-text-secondary hover:text-primary'}`}>
                  
                  {verifyingId === 'b1' ?
                  '🔍 Verifying...' :
                  verifiedId === 'b1' ?
                  '✅ Verified on Polygon' :

                  <>
                      <ExternalLinkIcon className="w-4 h-4" /> Verify on Polygon
                    </>
                  }
                </button>
                <button
                  onClick={() => handleShare('b1')}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                  
                  {sharedId === 'b1' ?
                  '🔗 Copied!' :

                  <>
                      <Share2Icon className="w-4 h-4" /> Share
                    </>
                  }
                </button>
              </div>
            </ContentCard>

            {/* Badge 2 */}
            <ContentCard className="relative overflow-hidden border-secondary/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] group">
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-secondary flex items-center justify-center shadow-lg flex-shrink-0 transform group-hover:scale-105 transition-transform">
                  <span className="text-3xl">⚡</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-text-primary flex items-center gap-1.5">
                    Wiring Specialist
                    <ShieldCheckIcon className="w-4 h-4 text-secondary" />
                  </h3>
                  <p className="text-sm text-text-secondary font-medium mt-1">
                    Completed 10 electrical jobs.
                  </p>
                  <p className="text-xs text-secondary font-bold mt-2">
                    Earned Feb 2026
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between relative z-10">
                <button
                  onClick={() => handleVerify('b2')}
                  disabled={verifyingId === 'b2' || verifiedId === 'b2'}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${verifiedId === 'b2' ? 'text-success' : 'text-text-secondary hover:text-secondary'}`}>
                  
                  {verifyingId === 'b2' ?
                  '🔍 Verifying...' :
                  verifiedId === 'b2' ?
                  '✅ Verified on Polygon' :

                  <>
                      <ExternalLinkIcon className="w-4 h-4" /> Verify on Polygon
                    </>
                  }
                </button>
                <button
                  onClick={() => handleShare('b2')}
                  className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg hover:bg-secondary/20 transition-colors">
                  
                  {sharedId === 'b2' ?
                  '🔗 Copied!' :

                  <>
                      <Share2Icon className="w-4 h-4" /> Share
                    </>
                  }
                </button>
              </div>
            </ContentCard>

            {/* Badge 3 */}
            <ContentCard className="relative overflow-hidden border-accent/30 shadow-[0_0_20px_rgba(139,92,246,0.15)] group">
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-accent flex items-center justify-center shadow-lg flex-shrink-0 transform group-hover:scale-105 transition-transform">
                  <span className="text-3xl">⭐</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-text-primary flex items-center gap-1.5">
                    Top Rated Worker
                    <ShieldCheckIcon className="w-4 h-4 text-accent" />
                  </h3>
                  <p className="text-sm text-text-secondary font-medium mt-1">
                    Maintained 4.8+ rating for 6 months.
                  </p>
                  <p className="text-xs text-accent font-bold mt-2">
                    Earned Jan 2026
                  </p>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>

        {/* In Progress */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            In Progress
          </h2>
          <div className="space-y-3">
            <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center opacity-70">
                  <span className="text-xl">🎓</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-text-primary">
                    Community Mentor
                  </h4>
                  <p className="text-xs text-text-secondary font-medium">
                    Answer 50 questions in community
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">60%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: '60%'
                  }} />
                
              </div>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-2 text-right">
                30 / 50 completed
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center opacity-70">
                  <span className="text-xl">🤝</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-text-primary">
                    Master Swapper
                  </h4>
                  <p className="text-xs text-text-secondary font-medium">
                    Complete 20 SkillSwaps
                  </p>
                </div>
                <span className="text-xs font-bold text-secondary">60%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{
                    width: '60%'
                  }} />
                
              </div>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-2 text-right">
                12 / 20 completed
              </p>
            </div>
          </div>
        </div>

        {/* Locked */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Available to Unlock
          </h2>
          <div className="space-y-3 opacity-60 grayscale-[50%]">
            <div className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center relative">
                <span className="text-2xl opacity-50">🏗️</span>
                <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5 shadow-sm">
                  <LockIcon className="w-3 h-3 text-text-secondary" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">
                  Master Builder
                </h4>
                <p className="text-xs text-text-secondary font-medium">
                  Complete 20 carpentry jobs
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-4 border border-border flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center relative">
                <span className="text-2xl opacity-50">🚗</span>
                <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5 shadow-sm">
                  <LockIcon className="w-3 h-3 text-text-secondary" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">
                  Fleet Commander
                </h4>
                <p className="text-xs text-text-secondary font-medium">
                  Complete 50 driving jobs
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>);

}