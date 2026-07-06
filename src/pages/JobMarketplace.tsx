import React, { useState } from 'react';
import {
  MicIcon,
  SparklesIcon,
  MapIcon,
  RefreshCwIcon,
  XIcon,
  BookmarkIcon } from
'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterChip } from '../components/ui/FilterChip';
import { JobCard } from '../components/ui/JobCard';
import { ActionButton } from '../components/ui/ActionButton';
import { api } from '../lib/api';
import { mapApiJob } from '../lib/mappers';

const FILTERS = [
'All',
'Nearby',
'Urgent',
'Electrician',
'Plumber',
'Mechanic',
'Carpenter',
'Driver'];

interface JobMarketplaceProps {
  onJobClick: (jobId: string) => void;
  onSkillSwap: () => void;
  onJobHubs: () => void;
  onCreateJob: () => void;
  onSavedJobs?: () => void;
}
export function JobMarketplace({
  onJobClick,
  onSkillSwap,
  onJobHubs,
  onCreateJob,
  onSavedJobs
}: JobMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState(false);

  const { data: apiJobs = [], isLoading } = useQuery({
    queryKey: ['jobs', searchQuery],
    queryFn: () =>
      api.jobs.list(searchQuery ? { search: searchQuery } : undefined),
  });

  const jobs = apiJobs.map(mapApiJob);

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate listening and processing
    setTimeout(() => {
      setIsListening(false);
      setVoiceResult(true);
      setSearchQuery('plumbing jobs in Johannesburg under R3,000 today');
    }, 3000);
  };
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
    searchQuery === '' ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.requiredSkills.some((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesFilter =
    activeFilter === 'All' ||
    activeFilter === 'Urgent' && job.isUrgent ||
    activeFilter === 'Nearby' && true ||
    // Cosmetic for now
    job.requiredSkills.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Voice Search Overlay */}
      {isListening &&
      <div className="absolute inset-0 z-50 bg-surface/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
          <button
          onClick={() => setIsListening(false)}
          className="absolute top-6 right-6 p-2 text-text-secondary">
          
            <XIcon className="w-6 h-6" />
          </button>

          <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            <div
            className="absolute inset-0 bg-secondary/20 rounded-full animate-ping"
            style={{
              animationDuration: '2s'
            }} />
          
            <div
            className="absolute inset-4 bg-secondary/40 rounded-full animate-ping"
            style={{
              animationDuration: '2s',
              animationDelay: '0.5s'
            }} />
          
            <div className="relative w-16 h-16 bg-gradient-to-br from-orange-400 to-secondary rounded-full flex items-center justify-center shadow-lg shadow-secondary/30">
              <MicIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-text-primary mb-2">
            Listening...
          </h2>
          <p className="text-text-secondary font-medium mb-12">
            Speak your request naturally
          </p>

          {/* Simulated waveform */}
          <div className="flex items-end gap-1.5 h-12">
            {[1, 2, 3, 4, 5, 6, 7].map((i) =>
          <div
            key={i}
            className="w-2 bg-secondary rounded-full animate-[bounce_1s_infinite]"
            style={{
              height: `${Math.max(20, Math.random() * 100)}%`,
              animationDelay: `${i * 0.1}s`
            }} />

          )}
          </div>
        </div>
      }

      {/* Voice Search Results */}
      {voiceResult &&
      <div className="absolute inset-0 z-50 bg-surface/95 backdrop-blur-md flex flex-col p-6 animate-fade-in">
          <button
          onClick={() => setVoiceResult(false)}
          className="absolute top-6 right-6 p-2 text-text-secondary">
          
            <XIcon className="w-6 h-6" />
          </button>

          <div className="mt-12 mb-8">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-black text-text-primary mb-2">
              I heard:
            </h2>
            <p className="text-xl text-text-secondary italic">
              "Find me plumbing jobs in Johannesburg under R3,000 today"
            </p>
          </div>

          <div className="bg-background rounded-3xl p-5 border border-border mb-8 shadow-card">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
              Parsed Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">Skill</span>
                <span className="font-bold text-text-primary bg-surface px-3 py-1 rounded-lg border border-border">
                  Plumbing
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">
                  Location
                </span>
                <span className="font-bold text-text-primary bg-surface px-3 py-1 rounded-lg border border-border">
                  Johannesburg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">Budget</span>
                <span className="font-bold text-text-primary bg-surface px-3 py-1 rounded-lg border border-border">
                  &lt; R3,000
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">Urgency</span>
                <span className="font-bold text-error bg-error/10 px-3 py-1 rounded-lg border border-error/20">
                  Today
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border">
              <span className="font-bold text-text-primary text-sm">
                Auto-Apply to top 3 matches?
              </span>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <ActionButton
            onClick={() => setVoiceResult(false)}
            variant="gradient"
            size="lg"
            className="shadow-lg">
            
              Search Jobs
            </ActionButton>
            <button
            onClick={() => {
              setVoiceResult(false);
              handleVoiceSearch();
            }}
            className="w-full py-3 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
            
              Try Again
            </button>
          </div>
        </div>
      }

      {/* Sticky Header */}
      <div className="bg-surface px-4 pb-3 pt-4 flex-shrink-0 border-b border-border shadow-sm relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Find Work
          </h1>
          <div className="flex gap-2">
            <button
              onClick={onSkillSwap}
              className="flex items-center gap-1.5 bg-secondary/10 text-secondary-dark px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-secondary/20 transition-colors">
              
              <RefreshCwIcon className="w-3.5 h-3.5" /> Swap
            </button>
            <button
              onClick={onJobHubs}
              className="flex-1 bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
              
              <MapIcon className="w-6 h-6 text-primary" />
              <span className="font-bold text-sm text-text-primary">
                Job Hubs
              </span>
            </button>
            <button
              onClick={onSavedJobs}
              className="flex-1 bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
              
              <BookmarkIcon className="w-6 h-6 text-secondary" />
              <span className="font-bold text-sm text-text-primary">
                Saved Jobs
              </span>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search jobs, skills..."
              onFilter={() => {}} />
            
          </div>
          <button
            onClick={handleVoiceSearch}
            className="w-12 h-12 bg-gradient-to-br from-orange-400 to-secondary rounded-2xl flex items-center justify-center shadow-md shadow-secondary/20 flex-shrink-0 active:scale-95 transition-transform">
            
            <MicIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 mt-4 pb-1 -mx-4 px-4">
          {FILTERS.map((filter) =>
          <FilterChip
            key={filter}
            label={filter}
            selected={activeFilter === filter}
            onToggle={() => setActiveFilter(filter)} />

          )}
        </div>
      </div>

      {/* Scrollable Job List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">
            Recommended Jobs
          </h2>
          <span className="text-sm text-text-secondary">
            {isLoading ? '-' : filteredJobs.length} results
          </span>
        </div>
        <div className="space-y-4 pb-4">
          {isLoading ?
          <>
              {[1, 2, 3].map((i) =>
            <div
              key={i}
              className="bg-surface rounded-3xl p-5 border border-border shadow-sm animate-pulse">
              
                  <div className="h-6 bg-border rounded-md w-3/4 mb-4"></div>
                  <div className="flex gap-4 mb-4">
                    <div className="h-4 bg-border rounded-md w-1/4"></div>
                    <div className="h-4 bg-border rounded-md w-1/4"></div>
                  </div>
                  <div className="flex gap-2 mb-5">
                    <div className="h-6 bg-border rounded-full w-16"></div>
                    <div className="h-6 bg-border rounded-full w-20"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-border"></div>
                      <div className="space-y-2">
                        <div className="h-5 bg-border rounded-md w-20"></div>
                        <div className="h-3 bg-border rounded-md w-16"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-border rounded-xl w-24"></div>
                  </div>
                </div>
            )}
            </> :
          filteredJobs.length > 0 ?
          filteredJobs.map((job) =>
          <JobCard
            key={job.id}
            job={job}
            onApply={() => onJobClick(job.id)} />

          ) :

          <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-1">
                No jobs found
              </h3>
              <p className="text-sm text-text-secondary font-medium">
                Try adjusting your search or filters
              </p>
            </div>
          }
        </div>
      </div>

      {/* Floating Action Button for Post Job */}
      {onCreateJob &&
      <button
        onClick={onCreateJob}
        className="absolute bottom-6 right-4 z-40 bg-gradient-to-r from-primary to-teal-500 text-white rounded-full p-4 shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center">
        
          <div className="flex items-center gap-2 font-bold">
            <span className="text-2xl leading-none mb-0.5">+</span>
            <span>Post Job</span>
          </div>
        </button>
      }
    </div>);

}