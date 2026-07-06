import React, { useState } from 'react';
import { ThumbsUpIcon, CheckCircleIcon } from 'lucide-react';
import { UserAvatar } from './ui/UserAvatar';
interface Endorsement {
  endorserName: string;
  endorserAvatar: string;
  skillName: string;
}
const MOCK_ENDORSEMENTS: Record<string, Endorsement[]> = {
  default: [
  {
    endorserName: 'David Omondi',
    endorserAvatar: 'https://i.pravatar.cc/150?u=david',
    skillName: 'Electrician'
  },
  {
    endorserName: 'Grace Wanjiku',
    endorserAvatar: 'https://i.pravatar.cc/150?u=grace',
    skillName: 'Wiring'
  },
  {
    endorserName: 'Kofi Asante',
    endorserAvatar: 'https://i.pravatar.cc/150?u=kofi',
    skillName: 'Electrician'
  }],

  w2: [
  {
    endorserName: 'Amara Okafor',
    endorserAvatar: 'https://i.pravatar.cc/150?u=amara',
    skillName: 'Carpenter'
  },
  {
    endorserName: 'Kwame Mensah',
    endorserAvatar: 'https://i.pravatar.cc/150?u=kwame',
    skillName: 'Furniture'
  },
  {
    endorserName: 'Zainab Mwangi',
    endorserAvatar: 'https://i.pravatar.cc/150?u=zainab',
    skillName: 'Renovation'
  }],

  w3: [
  {
    endorserName: 'TechHub Ltd',
    endorserAvatar: 'https://i.pravatar.cc/150?u=techhub',
    skillName: 'Mechanic'
  },
  {
    endorserName: 'Speedy Delivery',
    endorserAvatar: 'https://i.pravatar.cc/150?u=speedy',
    skillName: 'Engine Repair'
  },
  {
    endorserName: 'Amara Okafor',
    endorserAvatar: 'https://i.pravatar.cc/150?u=amara',
    skillName: 'Mechanic'
  }]

};
interface EndorsementsSectionProps {
  workerId: string;
  skills: {
    name: string;
    icon?: string;
    level: string;
  }[];
}
export function EndorsementsSection({
  workerId,
  skills
}: EndorsementsSectionProps) {
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const [endorsedSkill, setEndorsedSkill] = useState<string | null>(null);
  const endorsements =
  MOCK_ENDORSEMENTS[workerId] || MOCK_ENDORSEMENTS['default'];
  const handleEndorse = (skillName: string) => {
    setEndorsedSkill(skillName);
    setShowSkillPicker(false);
  };
  return (
    <div className="bg-surface mt-2 p-5 border-y border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <ThumbsUpIcon className="w-5 h-5 text-primary" />
          Endorsements
        </h2>
        <span className="text-xs font-bold text-text-secondary bg-background px-2 py-1 rounded-lg border border-border">
          {endorsements.length} total
        </span>
      </div>

      {/* Endorsement List */}
      <div className="space-y-3 mb-4">
        {endorsements.map((endorsement, i) =>
        <div
          key={i}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-background transition-colors">
          
            <UserAvatar
            src={endorsement.endorserAvatar}
            name={endorsement.endorserName}
            size="sm" />
          
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">
                <span className="font-bold">{endorsement.endorserName}</span>
                <span className="text-text-secondary"> endorsed </span>
                <span className="font-bold text-primary">
                  {endorsement.skillName}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Endorse Button / Skill Picker */}
      {endorsedSkill ?
      <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-2xl animate-fade-in">
          <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0" />
          <span className="text-sm font-bold text-success">
            You endorsed {endorsedSkill}!
          </span>
        </div> :
      showSkillPicker ?
      <div className="space-y-2 animate-fade-in">
          <p className="text-xs font-bold text-text-secondary mb-2">
            Select a skill to endorse:
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) =>
          <button
            key={i}
            onClick={() => handleEndorse(skill.name)}
            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-bold hover:bg-primary/20 active:scale-95 transition-all min-h-[40px]">
            
                {skill.icon ? `${skill.icon} ` : ''}
                {skill.name}
              </button>
          )}
          </div>
          <button
          onClick={() => setShowSkillPicker(false)}
          className="text-xs text-text-secondary font-bold mt-1">
          
            Cancel
          </button>
        </div> :

      <button
        onClick={() => setShowSkillPicker(true)}
        className="w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-sm font-bold hover:bg-primary/20 active:scale-95 transition-all min-h-[48px] flex items-center justify-center gap-2">
        
          <ThumbsUpIcon className="w-4 h-4" />
          Endorse a Skill
        </button>
      }
    </div>);

}