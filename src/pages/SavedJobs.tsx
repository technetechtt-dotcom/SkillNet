import React from 'react';
import { ArrowLeftIcon, BookmarkIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { JobCard } from '../components/ui/JobCard';
import { api } from '../lib/api';
import { mapApiJob } from '../lib/mappers';

interface SavedJobsProps {
  onBack: () => void;
  onJobClick: (jobId: string) => void;
}

export function SavedJobs({ onBack, onJobClick }: SavedJobsProps) {
  const { data: savedJobs = [], isLoading } = useQuery({
    queryKey: ['jobs', 'saved'],
    queryFn: () => api.jobs.saved(),
  });

  const jobs = savedJobs.map(mapApiJob);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center justify-between border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-text-primary">Saved Jobs</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <BookmarkIcon className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isLoading &&
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={() => onJobClick(job.id)} />
          ))}
        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-12">
            <BookmarkIcon className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-text-primary mb-2">
              No saved jobs
            </h3>
            <p className="text-text-secondary">
              Jobs you bookmark will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
