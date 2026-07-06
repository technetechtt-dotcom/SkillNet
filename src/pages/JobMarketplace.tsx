import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterChip } from '../components/ui/FilterChip';
import { JobCard } from '../components/ui/JobCard';
import { Job } from '../types';
import { api } from '../services/api';

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
}
export function JobMarketplace({ onJobClick }: JobMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    setIsLoading(true);
    setError('');
    const isFirstPage = page === 1;
    if (!isFirstPage) {
      setIsLoadingMore(true);
    }
    api.jobs(searchQuery, activeFilter, { page, pageSize: 6 })
      .then((data) => {
        setHasNextPage(data.hasNextPage);
        setJobs((prev) => (isFirstPage ? data.items : [...prev, ...data.items]));
      })
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : 'Could not load jobs.')
      )
      .finally(() => {
        setIsLoading(false);
        setIsLoadingMore(false);
      });
  }, [searchQuery, activeFilter, page]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Sticky Header */}
      <div className="bg-surface px-4 pb-3 pt-4 flex-shrink-0 border-b border-border">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Find Work</h1>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search jobs, skills, locations..."
          onFilter={() => setActiveFilter('All')} />

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
            {jobs.length} results
          </span>
        </div>
        {isLoading && <p className="text-text-secondary mb-3">Loading jobs...</p>}
        {error && <p className="text-error mb-3">{error}</p>}
        <div className="space-y-4 pb-4">
          {!isLoading && !error && jobs.map((job) =>
          <JobCard
            key={job.id}
            job={job}
            onApply={() => onJobClick(job.id)} />

          )}
          {!isLoading && !error && hasNextPage && (
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLoadingMore}
              className="w-full py-3 rounded-xl border border-border text-text-primary hover:bg-surface disabled:opacity-60"
            >
              {isLoadingMore ? 'Loading...' : 'Load more jobs'}
            </button>
          )}
        </div>
      </div>
    </div>);

}