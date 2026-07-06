import React from 'react';
import {
  GraduationCapIcon,
  TrophyIcon,
  AwardIcon,
  TrendingUpIcon,
  PlayCircleIcon,
  ChevronRightIcon,
  SparklesIcon,
  TargetIcon,
  LandmarkIcon,
  CoinsIcon,
  UsersIcon,
  ShieldCheckIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
interface SkillHubProps {
  onChallenges?: () => void;
  onCertifications?: () => void;
  onSkillSwap?: () => void;
  onSkillsManagement?: () => void;
  onProgramClick?: (id: string) => void;
}
const FEATURED_COURSES = [
{
  id: 'c1',
  title: 'Advanced Electrical Wiring',
  instructor: 'Master Joseph Khumalo',
  duration: '4h 20m',
  lessons: 12,
  level: 'Advanced',
  thumbnail:
  'https://images.unsplash.com/photo-1565608087341-404b25492fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  color: 'from-primary to-teal-700'
},
{
  id: 'c2',
  title: 'Modern Plumbing Techniques',
  instructor: 'Sarah Jenkins',
  duration: '3h 15m',
  lessons: 9,
  level: 'Intermediate',
  thumbnail:
  'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  color: 'from-secondary to-orange-700'
}];

const SKILL_CATEGORIES = [
{
  id: 's1',
  name: 'Electrical',
  icon: '⚡',
  count: 24,
  color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
},
{
  id: 's2',
  name: 'Plumbing',
  icon: '🔧',
  count: 18,
  color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
},
{
  id: 's3',
  name: 'Carpentry',
  icon: '🔨',
  count: 21,
  color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
},
{
  id: 's4',
  name: 'Mechanic',
  icon: '🔩',
  count: 15,
  color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
},
{
  id: 's5',
  name: 'Welding',
  icon: '🔥',
  count: 12,
  color: 'bg-red-500/10 text-red-600 dark:text-red-400'
},
{
  id: 's6',
  name: 'Tailoring',
  icon: '✂️',
  count: 9,
  color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
}];

export function SkillHub({
  onChallenges,
  onCertifications,
  onSkillSwap,
  onSkillsManagement,
  onProgramClick
}: SkillHubProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 border-b border-border shadow-sm">
        <h1 className="text-2xl font-black text-text-primary tracking-tight">
          Skill Hub
        </h1>
        <p className="text-xs text-text-secondary font-medium mt-0.5">
          Level up your trade. Stack your skills.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Progress Hero */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-primary via-teal-600 to-teal-800 rounded-3xl p-5 text-white shadow-elevated relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <TrendingUpIcon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Your Progress
                </span>
              </div>
              <h2 className="text-3xl font-black mb-1">NQF Level 4</h2>
              <p className="text-white/80 text-sm font-medium mb-4">
                3 skills certified · 2 in progress
              </p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{
                    width: '68%'
                  }} />
                
              </div>
              <p className="text-xs text-white/80 font-medium">
                68% to next level
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onChallenges}
              className="bg-surface rounded-2xl border border-border p-4 shadow-sm flex flex-col items-start gap-2 active:scale-[0.97] transition-transform hover:border-secondary/50">
              
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-text-primary text-sm">
                  Challenges
                </p>
                <p className="text-[11px] text-text-secondary">Compete & win</p>
              </div>
            </button>
            <button
              onClick={onCertifications}
              className="bg-surface rounded-2xl border border-border p-4 shadow-sm flex flex-col items-start gap-2 active:scale-[0.97] transition-transform hover:border-primary/50">
              
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <AwardIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-text-primary text-sm">
                  Certificates
                </p>
                <p className="text-[11px] text-text-secondary">View & verify</p>
              </div>
            </button>
            <button
              onClick={onSkillSwap}
              className="bg-surface rounded-2xl border border-border p-4 shadow-sm flex flex-col items-start gap-2 active:scale-[0.97] transition-transform hover:border-accent/50">
              
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-bold text-text-primary text-sm">
                  Skill Swap
                </p>
                <p className="text-[11px] text-text-secondary">
                  Trade expertise
                </p>
              </div>
            </button>
            <button
              onClick={onSkillsManagement}
              className="bg-surface rounded-2xl border border-border p-4 shadow-sm flex flex-col items-start gap-2 active:scale-[0.97] transition-transform hover:border-success/50">
              
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TargetIcon className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <p className="font-bold text-text-primary text-sm">My Skills</p>
                <p className="text-[11px] text-text-secondary">Manage list</p>
              </div>
            </button>
          </div>
        </div>

        {/* National Skills & Employment Hero (merged from Government Hub) */}
        <div className="px-4 mb-4">
          <div className="bg-gradient-to-br from-secondary via-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-elevated relative overflow-hidden">
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
        </div>

        {/* Available Programs (merged from Government Hub) */}
        <div className="px-4 mb-2">
          <h3 className="font-bold text-text-primary text-lg px-2 mt-2 mb-3">
            Available Programs
          </h3>

          {/* Grants & Funding */}
          <div
            onClick={() => onProgramClick?.('grants')}
            className="bg-surface rounded-3xl border border-border p-4 shadow-sm flex items-start gap-4 cursor-pointer hover:border-primary/50 transition-colors active:scale-[0.98] mb-3">
            
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
            className="bg-surface rounded-3xl border border-border p-4 shadow-sm flex items-start gap-4 cursor-pointer hover:border-secondary/50 transition-colors active:scale-[0.98] mb-3">
            
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <GraduationCapIcon className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-text-primary text-base mb-1">
                SETA Learnerships
              </h4>
              <p className="text-xs text-text-secondary font-medium mb-2 line-clamp-2">
                Apply for accredited learnerships across 21 SETAs. Earn a
                stipend while gaining NQF-aligned qualifications.
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
        </div>

        {/* Compliance & Safety (merged from Government Hub) */}
        <div className="px-4 mb-6">
          <h3 className="font-bold text-text-primary text-lg px-2 mt-4 mb-3">
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
              <span className="text-sm font-bold text-text-primary">
                Status
              </span>
              <span className="text-sm font-bold text-error flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error" /> Not
                Registered
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
        </div>

        {/* Featured Courses */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">
              Featured Courses
            </h2>
            <button className="text-primary text-sm font-bold">See All</button>
          </div>
          <div className="space-y-3">
            {FEATURED_COURSES.map((course) =>
            <button
              key={course.id}
              className="w-full bg-surface rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-card transition-shadow text-left active:scale-[0.98]">
              
                <div className="relative h-32 overflow-hidden">
                  <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover" />
                
                  <div
                  className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-40`} />
                
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <PlayCircleIcon className="w-6 h-6 text-text-primary" />
                    </div>
                  </div>
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    {course.duration}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {course.level}
                    </span>
                    <span className="text-[11px] text-text-secondary font-medium">
                      {course.lessons} lessons
                    </span>
                  </div>
                  <h3 className="font-bold text-text-primary mb-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium">
                    by {course.instructor}
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Skill Categories */}
        <div className="px-4 mb-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Browse Skills
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {SKILL_CATEGORIES.map((cat) =>
            <button
              key={cat.id}
              className="bg-surface rounded-2xl border border-border p-3 shadow-sm flex flex-col items-center gap-2 active:scale-[0.95] transition-transform hover:border-primary/50">
              
                <div
                className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-2xl`}>
                
                  {cat.icon}
                </div>
                <div className="text-center">
                  <p className="font-bold text-text-primary text-xs">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    {cat.count} courses
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>);

}