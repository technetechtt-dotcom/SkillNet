import React from 'react';
import { MapPinIcon, ClockIcon, FlameIcon } from 'lucide-react';
import { Job } from '../../types';
import { ContentCard } from './ContentCard';
import { SkillTag } from './SkillTag';
import { ActionButton } from './ActionButton';
import { UserAvatar } from './UserAvatar';
interface JobCardProps {
  job: Job;
  onApply: () => void;
}
export function JobCard({ job, onApply }: JobCardProps) {
  return (
    <ContentCard className="relative mb-4 hover:border-primary/40 group">
      {job.isUrgent &&
      <div className="absolute top-0 right-0 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl flex items-center gap-1 shadow-sm">
          <FlameIcon className="w-3.5 h-3.5" />
          URGENT
        </div>
      }

      <div className="flex justify-between items-start mb-3 pr-20">
        <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
          {job.title}
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-text-secondary font-medium">
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="w-4 h-4 text-primary/70" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon className="w-4 h-4 text-primary/70" />
          <span>{job.postedTime}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {job.requiredSkills.map((skill, index) =>
        <SkillTag
          key={index}
          name={skill}
          size="sm"
          className="bg-primary/10 text-primary-dark border-none font-semibold" />

        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <UserAvatar
            src={job.employer.avatar}
            name={job.employer.name}
            size="sm" />
          
          <div>
            <div className="bg-primary/10 text-primary-dark rounded-xl px-3 py-1 inline-block">
              <span className="text-lg font-bold">{job.payment}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider ml-1">
                /{job.paymentType}
              </span>
            </div>
            <p className="text-xs text-text-secondary font-medium mt-1 ml-1">
              {job.employer.name}
            </p>
          </div>
        </div>
        <ActionButton
          size="sm"
          variant="gradient"
          onClick={onApply}
          className="min-w-[100px] shadow-sm">
          
          Apply
        </ActionButton>
      </div>
    </ContentCard>);

}