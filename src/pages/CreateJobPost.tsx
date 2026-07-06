import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  MapPinIcon,
  BriefcaseIcon,
  DollarSignIcon,
  ClockIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { api, ApiError } from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';
interface CreateJobPostProps {
  onBack: () => void;
  onSubmit: () => void;
}
export function CreateJobPost({ onBack, onSubmit }: CreateJobPostProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [payment, setPayment] = useState('');
  const [paymentType, setPaymentType] = useState('fixed');
  const [skills, setSkills] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.jobs.create({
        title,
        description,
        location,
        paymentAmount: Number(payment.replace(/,/g, '')),
        paymentCurrency: 'ZAR',
        paymentType,
        requiredSkills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        isUrgent,
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      onSubmit();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">Post a Job</h1>
        <div className="w-[48px]" /> {/* Spacer for centering */}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-surface p-5 rounded-3xl border border-border shadow-sm space-y-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-primary" />
              Job Details
            </h2>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Need urgent plumbing repair"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work required, tools needed, etc."
                rows={4}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" />
              
            </div>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">
                Required Skills (comma separated)
              </label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Plumber, Pipe Fitting"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              
            </div>
          </div>

          {/* Location & Payment */}
          <div className="bg-surface p-5 rounded-3xl border border-border shadow-sm space-y-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-secondary" />
              Location & Budget
            </h2>

            <div>
              <label className="block text-sm font-bold text-text-primary mb-1.5">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sandton, Johannesburg"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">
                  Budget
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSignIcon className="w-4 h-4 text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    required
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    placeholder="e.g. 45,000"
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                  
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">
                  Type
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none">
                  
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="daily">Daily Rate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-surface p-5 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-error" />
                  Urgent Request
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Highlight this job to get faster responses
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUrgent(!isUrgent)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${isUrgent ? 'bg-error' : 'bg-border'}`}>
                
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isUrgent ? 'left-7' : 'left-1'}`} />
                
              </button>
            </div>
          </div>

          <div className="pt-4 pb-8">
            <ActionButton
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={isSubmitting}>
              
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>);

}