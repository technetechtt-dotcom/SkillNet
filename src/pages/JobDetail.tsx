import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  ShieldIcon,
  BookmarkIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { SkillTag } from '../components/ui/SkillTag';
import { UserAvatar } from '../components/ui/UserAvatar';
import { RatingStars } from '../components/ui/RatingStars';
import { Job } from '../types';
import { api } from '../services/api';
interface JobDetailProps {
  jobId: string;
  onBack: () => void;
  onApply: () => void;
}
export function JobDetail({ jobId, onBack, onApply }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    api.job(jobId)
      .then(setJob)
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : 'Failed to load job details.')
      );
  }, [jobId]);

  if (!job && !error) {
    return <div className="p-6 text-text-secondary">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-error">{error || 'Job not found.'}</p>
        <ActionButton onClick={onBack}>Go Back</ActionButton>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">

          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Job Details</h1>
        <button className="p-2 -mr-2 text-text-secondary hover:text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          <BookmarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Title & Meta */}
        <div className="bg-surface p-6 mb-2">
          {job.isUrgent &&
          <span className="inline-block bg-error/10 text-error text-xs font-bold px-3 py-1 rounded-full mb-3">
              URGENT REQUEST
            </span>
          }
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

        {/* Employer Info */}
        <div className="bg-surface p-6 mb-2">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            About Employer
          </h3>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <UserAvatar
                src={job.employer.avatar}
                name={job.employer.name}
                size="lg" />

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
            <button className="text-primary text-sm font-semibold px-3 py-1.5 bg-primary/10 rounded-full flex-shrink-0 min-h-[40px]">
              View
            </button>
          </div>
        </div>

        {/* Description & Skills */}
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
            {job.requiredSkills.map((skill, index) =>
            <SkillTag key={index} name={skill} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar — in flow, not fixed */}
      <div className="p-4 bg-surface border-t border-border flex-shrink-0 flex gap-3">
        <ActionButton
          variant="outline"
          fullWidth={false}
          className="px-6"
          onClick={onBack}>

          Save
        </ActionButton>
        <ActionButton onClick={onApply} className="flex-1">
          Apply Now
        </ActionButton>
      </div>
    </div>);

}