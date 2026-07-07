import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  LandmarkIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  UsersIcon,
  CoinsIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ActionButton } from '../components/ui/ActionButton';
import { api, ApiProgram } from '../lib/api';

interface GovernmentHubProps {
  onBack: () => void;
  onProgramClick?: (id: string) => void;
}

const PROGRAM_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  grants: CoinsIcon,
  seta: GraduationCapIcon,
  yes: UsersIcon,
  coida: ShieldCheckIcon,
};

function programBadge(program: ApiProgram): string {
  if (program.fundingAmount) return program.fundingAmount;
  if (program.spots != null) return `${program.spots} Open Spots`;
  if (program.stipend) return program.stipend;
  return program.status === 'active' ? 'Open' : program.status;
}

function programStyles(type: string) {
  if (type === 'grants') {
    return {
      hover: 'hover:border-primary/50',
      iconBg: 'bg-primary/10',
      iconText: 'text-primary',
      badge: 'bg-primary/10 text-primary',
    };
  }
  if (type === 'seta') {
    return {
      hover: 'hover:border-secondary/50',
      iconBg: 'bg-secondary/10',
      iconText: 'text-secondary',
      badge: 'bg-secondary/10 text-secondary',
    };
  }
  if (type === 'yes') {
    return {
      hover: 'hover:border-accent/50',
      iconBg: 'bg-accent/10',
      iconText: 'text-accent',
      badge: 'bg-accent/10 text-accent',
    };
  }
  return {
    hover: 'hover:border-primary/50',
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    badge: 'bg-primary/10 text-primary',
  };
}

export function GovernmentHub({ onBack, onProgramClick }: GovernmentHubProps) {
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: () => api.programs.list(),
  });

  return (
    <div className="flex flex-col h-full bg-background relative">
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

        <h3 className="font-bold text-text-primary text-lg px-2 mt-2">
          Available Programs
        </h3>

        {isLoading && (
          <div className="bg-surface rounded-3xl border border-border p-6 animate-pulse h-24" />
        )}

        {!isLoading && programs.length === 0 && (
          <div className="bg-surface rounded-3xl border border-border p-6 text-center">
            <p className="text-sm text-text-secondary font-medium">
              No programs available yet. Check back soon.
            </p>
          </div>
        )}

        {programs.map((program) => {
          const Icon = PROGRAM_ICONS[program.type] || LandmarkIcon;
          const styles = programStyles(program.type);
          return (
            <div
              key={program.id}
              onClick={() => onProgramClick?.(program.slug)}
              className={`bg-surface rounded-3xl border border-border p-4 shadow-sm flex items-start gap-4 cursor-pointer transition-colors active:scale-[0.98] ${styles.hover}`}>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
                <Icon className={`w-6 h-6 ${styles.iconText}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-text-primary text-base mb-1">
                  {program.title}
                </h4>
                <p className="text-xs text-text-secondary font-medium mb-2 line-clamp-2">
                  {program.description ||
                    `${program.provider || 'Government'} · ${program.location || 'South Africa'}`}
                </p>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${styles.badge}`}>
                  {programBadge(program)}
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-text-secondary self-center" />
            </div>
          );
        })}

        <h3 className="font-bold text-text-primary text-lg px-2 mt-6">
          Compliance & Safety
        </h3>

        <div className="bg-surface rounded-3xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-bold text-text-primary">COIDA Registration</h4>
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
    </div>
  );
}
