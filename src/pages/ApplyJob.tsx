import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  FileTextIcon,
  DollarSignIcon,
  ClockIcon,
  CheckCircleIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { useQuery } from '@tanstack/react-query';
import { api, ApiError } from '../lib/api';
import { mapApiJob } from '../lib/mappers';

interface ApplyJobProps {
  jobId: string;
  onBack: () => void;
  onSubmit: () => void;
}
export function ApplyJob({ jobId, onBack, onSubmit }: ApplyJobProps) {
  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: apiJob } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.jobs.get(jobId),
  });

  const job = apiJob ? mapApiJob(apiJob) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const message = `${pitch}\n\nProposed rate: ${proposedRate}\nEstimated time: ${estimatedTime}`;
      await api.jobs.apply(jobId, message);
      setIsSuccess(true);
      setTimeout(() => onSubmit(), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Application failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSuccess) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircleIcon className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Application Sent!
        </h2>
        <p className="text-text-secondary">
          The employer will review your application and get back to you soon.
        </p>
      </div>);

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
        <h1 className="text-lg font-bold text-text-primary">Apply for Job</h1>
        <div className="w-[48px]" /> {/* Spacer for centering */}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-primary mb-1">Applying for:</h3>
          <p className="text-sm text-text-primary font-bold line-clamp-2">
            {job?.title || 'Loading...'}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
            <span>{job?.employer.name}</span>
            <span>•</span>
            <span>{job?.payment}</span>
            <span>•</span>
            <span>{job?.location}</span>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pitch */}
          <div className="bg-surface p-5 rounded-3xl border border-border shadow-sm space-y-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-primary" />
              Your Pitch
            </h2>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">
                Why are you the best fit?
              </label>
              <textarea
                required
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Describe your experience and how you'll handle this job..."
                rows={5}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" />
              
            </div>
          </div>

          {/* Terms */}
          <div className="bg-surface p-5 rounded-3xl border border-border shadow-sm space-y-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <DollarSignIcon className="w-5 h-5 text-secondary" />
              Your Terms
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">
                  Proposed Rate
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-text-secondary font-bold">₦</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    placeholder="e.g. 45,000"
                    className="w-full bg-background border border-border rounded-xl pl-8 pr-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                  
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">
                  Estimated Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="w-4 h-4 text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    required
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="e.g. 2 days"
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                  
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-8">
            <ActionButton
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={isSubmitting}>
              
              {isSubmitting ? 'Sending...' : 'Submit Application'}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>);

}