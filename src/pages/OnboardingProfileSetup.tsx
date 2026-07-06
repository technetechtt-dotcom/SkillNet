import React, { useState } from 'react';
import { ArrowLeftIcon, CameraIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { SkillTag } from '../components/ui/SkillTag';
interface OnboardingProfileSetupProps {
  onComplete: () => void;
  onBack: () => void;
}
const SKILLS_LIST = [
{
  name: 'Electrician',
  icon: '⚡'
},
{
  name: 'Mechanic',
  icon: '🔧'
},
{
  name: 'Carpenter',
  icon: '🪚'
},
{
  name: 'Farmer',
  icon: '🌾'
},
{
  name: 'Chef',
  icon: '👨‍🍳'
},
{
  name: 'Driver',
  icon: '🚗'
},
{
  name: 'Hairdresser',
  icon: '💇'
},
{
  name: 'Plumber',
  icon: '🔨'
},
{
  name: 'Painter',
  icon: '🎨'
},
{
  name: 'Tech',
  icon: '📱'
},
{
  name: 'Tailor',
  icon: '👔'
},
{
  name: 'Cleaner',
  icon: '🧹'
}];

export function OnboardingProfileSetup({
  onComplete,
  onBack
}: OnboardingProfileSetupProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
    prev.includes(skillName) ?
    prev.filter((s) => s !== skillName) :
    [...prev, skillName]
    );
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-4 flex items-center flex-shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">

          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 flex justify-center pr-8">
          <div className="flex gap-2">
            <div className="w-8 h-1.5 bg-border rounded-full" />
            <div className="w-8 h-1.5 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-2 flex flex-col overflow-hidden">
        <div className="flex flex-col items-center mb-6 flex-shrink-0">
          <div className="relative w-24 h-24 bg-surface border-2 border-dashed border-border rounded-full flex flex-col items-center justify-center mb-4 cursor-pointer hover:border-primary transition-colors">
            <CameraIcon className="w-7 h-7 text-text-secondary mb-1" />
            <span className="text-[10px] text-text-secondary font-medium">
              Add Photo
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary text-center">
            Select Your Skills
          </h1>
          <p className="text-text-secondary text-center text-sm mt-1">
            Choose the services you offer
          </p>
        </div>

        {/* Scrollable Skills Grid */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-4">
          <div className="grid grid-cols-3 gap-3">
            {SKILLS_LIST.map((skill) =>
            <SkillTag
              key={skill.name}
              name={skill.name}
              icon={skill.icon}
              selectable
              selected={selectedSkills.includes(skill.name)}
              onSelect={() => toggleSkill(skill.name)} />

            )}
          </div>
        </div>

        {/* Bottom Action */}
        <div className="py-4 flex-shrink-0">
          <ActionButton
            onClick={onComplete}
            disabled={selectedSkills.length === 0}>

            Complete Setup{' '}
            {selectedSkills.length > 0 && `(${selectedSkills.length})`}
          </ActionButton>
        </div>
      </div>
    </div>);

}