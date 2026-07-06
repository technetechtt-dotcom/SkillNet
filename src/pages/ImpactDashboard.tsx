import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  TrendingUpIcon,
  UsersIcon,
  BriefcaseIcon,
  AwardIcon,
  BarChart3Icon,
  DownloadIcon,
  ShareIcon,
  MapPinIcon,
  ShieldCheckIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
interface ImpactDashboardProps {
  onBack: () => void;
}
export function ImpactDashboard({ onBack }: ImpactDashboardProps) {
  const [activeToast, setActiveToast] = useState<string | null>(null);
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
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              Impact Dashboard
            </h1>
            <p className="text-xs text-text-secondary font-medium">
              Real-time platform metrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => showToast('📤 Share link copied!')}
            className="p-2 text-text-secondary hover:bg-primary/10 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            
            <ShareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => showToast('📊 Report downloading...')}
            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Hero Stat */}
        <div className="bg-gradient-to-br from-primary via-teal-600 to-teal-800 rounded-3xl p-6 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="w-5 h-5 text-teal-200" />
              <span className="text-sm font-bold text-teal-100 uppercase tracking-wider">
                Total Economic Value Created
              </span>
            </div>
            <h2 className="text-4xl font-black mb-1">R 42.5M</h2>
            <p className="text-teal-100 text-sm font-medium">
              +15% from last quarter
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface p-4 rounded-3xl border border-border shadow-sm">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
              <BriefcaseIcon className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-2xl font-black text-text-primary mb-1">12,450</p>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Jobs Facilitated
            </p>
          </div>
          <div className="bg-surface p-4 rounded-3xl border border-border shadow-sm">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
              <UsersIcon className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-black text-text-primary mb-1">8,200</p>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Active Workers
            </p>
          </div>
          <div className="bg-surface p-4 rounded-3xl border border-border shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <AwardIcon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-black text-text-primary mb-1">45%</p>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              NQF Aligned
            </p>
          </div>
          <div className="bg-surface p-4 rounded-3xl border border-border shadow-sm">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center mb-3">
              <BarChart3Icon className="w-5 h-5 text-error" />
            </div>
            <p className="text-2xl font-black text-text-primary mb-1">38%</p>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Female Inclusion
            </p>
          </div>
        </div>

        {/* B-BBEE Compliance Tracker */}
        <div className="bg-surface rounded-3xl border border-border p-5 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-success" />
            B-BBEE Skills Spend
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Track your enterprise and supplier development spend on the
            platform.
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-text-primary">Target: R 500,000</span>
                <span className="text-primary">65%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: '65%'
                  }} />
                
              </div>
            </div>
          </div>
          <ActionButton
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => showToast('📄 B-BBEE report downloading...')}>
            
            Download B-BBEE Report
          </ActionButton>
        </div>

        {/* Township Economy Heatmap */}
        <div className="bg-surface rounded-3xl border border-border p-5 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-secondary" />
            Township Economy Activity
          </h3>
          <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative mb-3">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Map"
              className="w-full h-full object-cover opacity-50" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Live Heatmap Active
              </span>
            </div>
          </div>
          <p className="text-xs text-text-secondary font-medium text-center">
            Showing high density of informal sector formalization in Soweto and
            Khayelitsha.
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>);

}