import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  LandmarkIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  UsersIcon,
  CoinsIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
interface GovernmentHubProps {
  onBack: () => void;
  onProgramClick?: (id: string) => void;
}
export function GovernmentHub({ onBack, onProgramClick }: GovernmentHubProps) {
  const [activeToast, setActiveToast] = useState<string | null>(null);
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
        <div>
          <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
            Government Hub
          </h1>
          <p className="text-xs text-text-secondary font-medium">
            National programs & compliance
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Hero */}
        <div className="bg-gradient-to-br from-secondary via-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-elevated relative overflow-hidden mb-2">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <LandmarkIcon className="w-8 h-8 text-white/80 mb-3" />
            <h2 className="text-2xl font-black mb-2 leading-tight">
              National Skills & Employment
            </h2>
            <p className="text-white/90 text-sm font-medium mb-4">
              Connect your profile with official government programs to access
              funding, learnerships, and work opportunities.
            </p>
            <ActionButton
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => onProgramClick?.('id-link')}>
              
              Link ID Number
            </ActionButton>
          </div>
        </div>

        {/* Programs List */}
        <h3 className="font-bold text-text-primary text-lg px-2 mt-2">
          Available Programs
        </h3>

        {/* Grants & Funding (replaces EPWP) */}
        <div
          onClick={() => onProgramClick?.('grants')}
          className="bg-surface rounded-3xl border border-border p-4 shadow-sm flex items-start gap-4 cursor-pointer hover:border-primary/50 transition-colors active:scale-[0.98]">
          
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CoinsIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-text-primary text-base mb-1">
              Grants & Funding
            </h4>
            <p className="text-xs text-text-secondary font-medium mb-2 line-clamp-2">
              Browse active grants and funding from NEF, SEFA, NYDA, NSFAS and
              private foundations.
            </p>
            <span className="inline-block bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              R 2.4B Available
            </span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-text-secondary self-center" />
        </div>

        {/* SETA Learnerships */}
        <div
          onClick={() => onProgramClick?.('seta')}
          className="bg-surface rounded-3xl border border-border p-4 shadow-sm flex items-start gap-4 cursor-pointer hover:border-secondary/50 transition-colors active:scale-[0.98]">
          
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <GraduationCapIcon className="w-6 h-6 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-text-primary text-base mb-1">
              SETA Learnerships
            </h4>
            <p className="text-xs text-text-secondary font-medium mb-2 line-clamp-2">
              Apply for accredited learnerships across 21 SETAs. Earn a stipend
              while gaining NQF-aligned qualifications.
            </p>
            <span className="inline-block bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              42 Open Learnerships
            </span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-text-secondary self-center" />
        </div>

        {/* YES Program */}
        <div
          onClick={() => onProgramClick?.('yes')}
          className="bg-surface rounded-3xl border border-border p-4 shadow-sm flex items-start gap-4 cursor-pointer hover:border-accent/50 transition-colors active:scale-[0.98]">
          
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <UsersIcon className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-text-primary text-base mb-1">
              YES Youth Initiative
            </h4>
            <p className="text-xs text-text-secondary font-medium mb-2 line-clamp-2">
              Youth Employment Service. 12-month quality work experience for
              youth under 35.
            </p>
            <span className="inline-block bg-background border border-border text-text-secondary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              Verify Age Eligibility
            </span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-text-secondary self-center" />
        </div>

        {/* Compliance Section */}
        <h3 className="font-bold text-text-primary text-lg px-2 mt-6">
          Compliance & Safety
        </h3>

        <div className="bg-surface rounded-3xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-bold text-text-primary">
                COIDA Registration
              </h4>
              <p className="text-xs text-text-secondary">
                Compensation Fund compliance
              </p>
            </div>
          </div>
          <div className="bg-background rounded-xl p-3 border border-border flex items-center justify-between">
            <span className="text-sm font-bold text-text-primary">Status</span>
            <span className="text-sm font-bold text-error flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-error" /> Not Registered
            </span>
          </div>
          <ActionButton
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={() => onProgramClick?.('coida')}>
            
            Start Registration
          </ActionButton>
        </div>

        <div className="h-6" />
      </div>
    </div>);

}