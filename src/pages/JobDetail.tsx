import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  ShieldIcon,
  BookmarkIcon,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActionButton } from '../components/ui/ActionButton';
import { SkillTag } from '../components/ui/SkillTag';
import { UserAvatar } from '../components/ui/UserAvatar';
import { RatingStars } from '../components/ui/RatingStars';
import { api } from '../lib/api';
import { mapApiJob } from '../lib/mappers';

interface JobDetailProps {
  jobId: string;
  onBack: () => void;
  onApplyClick?: () => void;
  onEmployerClick?: (employerId: string) => void;
}

export function JobDetail({
  jobId,
  onBack,
  onApplyClick,
  onEmployerClick,
}: JobDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();

  const { data: apiJob, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.jobs.get(jobId),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      isSaved ? api.jobs.unsave(jobId) : api.jobs.save(jobId),
    onSuccess: () => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ['jobs', 'saved'] });
    },
  });

  if (isLoading || !apiJob) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const job = mapApiJob(apiJob);

  const handleApply = () => {
    if (onApplyClick) onApplyClick();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Job Details</h1>
        <button
          onClick={() => saveMutation.mutate()}
          className="p-2 -mr-2 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          <BookmarkIcon
            className={`w-6 h-6 transition-colors ${isSaved ? 'fill-primary text-primary' : ''}`}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-surface p-6 mb-2">
          {job.isUrgent && (
            <span className="inline-block bg-error/10 text-error text-xs font-bold px-3 py-1 rounded-full mb-3">
              URGENT REQUEST
            </span>
          )}
          <h2 className="text-2xl font-bold text-text-primary mb-4 leading-tight">
            {job.title}
          </h2>

          <div className="flex flex-col gap-3 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-text-primary">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <span>
                Posted {job.postedTime} • {job.applicants} applicants
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/20 flex justify-between items-center">
            <div>
              <p className="text-sm text-text-secondary mb-1">Budget</p>
              <p className="text-2xl font-bold text-primary">{job.payment}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary mb-1">Type</p>
              <p className="font-semibold text-text-primary capitalize">
                {job.paymentType}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 mb-2">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            About Employer
          </h3>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <UserAvatar
                src={job.employer.avatar}
                name={job.employer.name}
                size="lg"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-text-primary flex items-center gap-1">
                  {job.employer.name}
                  <ShieldIcon className="w-4 h-4 text-success flex-shrink-0" />
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={job.employer.rating} size="sm" />
                  <span className="text-xs text-text-secondary">
                    ({job.employer.completedJobs} jobs)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onEmployerClick?.(job.employer.id)}
              className="text-primary text-sm font-semibold px-3 py-1.5 bg-primary/10 rounded-full flex-shrink-0 min-h-[40px]">
              View
            </button>
          </div>
        </div>

        <div className="bg-surface p-6 mb-2">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Description
          </h3>
          <p className="text-text-secondary leading-relaxed mb-6 whitespace-pre-line">
            {job.description}
          </p>

          <h3 className="text-lg font-bold text-text-primary mb-4">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, index) => (
              <SkillTag key={index} name={skill} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-surface border-t border-border flex-shrink-0 flex gap-3">
        <ActionButton
          variant="outline"
          fullWidth={false}
          className="px-6"
          onClick={() => saveMutation.mutate()}>
          {isSaved ? 'Saved ✓' : 'Save'}
        </ActionButton>
        <ActionButton onClick={handleApply} className="flex-1">
          Apply Now
        </ActionButton>
      </div>
    </div>
  );
}
