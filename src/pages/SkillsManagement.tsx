import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  EditIcon,
  XIcon,
  CheckIcon,
  ArrowLeftIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';
interface SkillItem {
  id: string;
  name: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'expert';
}
const INITIAL_SKILLS: SkillItem[] = [];

const ALL_SKILLS = [
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

const LEVEL_CONFIG = {
  beginner: {
    label: 'Beginner',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    progress: 'w-1/3',
    barColor: 'bg-blue-500'
  },
  intermediate: {
    label: 'Intermediate',
    color:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    progress: 'w-2/3',
    barColor: 'bg-amber-500'
  },
  expert: {
    label: 'Expert',
    color:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    progress: 'w-full',
    barColor: 'bg-emerald-500'
  }
};
interface SkillsManagementProps {
  onBack: () => void;
}
export function SkillsManagement({ onBack }: SkillsManagementProps) {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNewSkill, setSelectedNewSkill] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<
    'beginner' | 'intermediate' | 'expert'>(
    'beginner');
  useEffect(() => {
    if (user?.skills) {
      setSkills(
        user.skills.map((s) => ({
          id: s.id,
          name: s.name,
          icon: s.icon,
          level: s.level,
        }))
      );
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.users.updateSkills(
        skills.map((s) => ({ name: s.name, icon: s.icon, level: s.level }))
      );
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onBack();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (!selectedNewSkill) return;
    const skillInfo = ALL_SKILLS.find((s) => s.name === selectedNewSkill);
    if (!skillInfo) return;
    const newSkill: SkillItem = {
      id: Date.now().toString(),
      name: skillInfo.name,
      icon: skillInfo.icon,
      level: selectedLevel
    };
    setSkills([...skills, newSkill]);
    setShowAddModal(false);
    setSelectedNewSkill(null);
    setSelectedLevel('beginner');
  };
  const removeSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };
  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-text-primary">My Skills</h1>
          <p className="text-xs text-text-secondary font-medium mt-0.5">
            Manage your skills and experience levels
          </p>
        </div>
      </div>

      {/* Skills List */}
      <div className="flex-1 overflow-y-auto p-4">
        {skills.length === 0 ?
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🛠️</span>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              No skills added yet
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-[250px]">
              Add your skills to help employers find you for the right jobs.
            </p>
            <ActionButton
            size="md"
            fullWidth={false}
            onClick={() => setShowAddModal(true)}>
            
              Add Your First Skill
            </ActionButton>
          </div> :

        <div className="space-y-3">
            {skills.map((skill) => {
            const config = LEVEL_CONFIG[skill.level];
            return (
              <div
                key={skill.id}
                className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-4">
                
                  <span className="text-3xl">{skill.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary">
                      {skill.name}
                    </h3>
                    <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${config.color}`}>
                    
                      {config.label}
                    </span>
                    <div className="w-full h-1.5 bg-border rounded-full mt-2">
                      <div
                      className={`h-full rounded-full ${config.barColor} ${config.progress} transition-all`} />
                    
                    </div>
                  </div>
                  <button
                  onClick={() => removeSkill(skill.id)}
                  className="p-2 text-text-secondary hover:text-error transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`Remove ${skill.name}`}>
                  
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>);

          })}
          </div>
        }

        {skills.length > 0 &&
        <div className="mt-6">
            <ActionButton
            variant="outline"
            onClick={() => setShowAddModal(true)}
            icon={<PlusIcon className="w-5 h-5" />}>
            
              Add New Skill
            </ActionButton>
          </div>
        }
      </div>

      {/* Add Skill Modal */}
      {showAddModal &&
      <div className="absolute inset-0 z-50 flex items-end">
          <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowAddModal(false)} />
        
          <div className="relative w-full bg-surface rounded-t-3xl p-6 max-h-[80%] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                Add a Skill
              </h2>
              <button
              onClick={() => setShowAddModal(false)}
              className="p-2 text-text-secondary min-h-[44px] min-w-[44px] flex items-center justify-center">
              
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Skill Selection */}
            <p className="text-sm font-medium text-text-secondary mb-3">
              Choose a skill
            </p>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 mb-4">
              {ALL_SKILLS.filter(
              (s) => !skills.find((existing) => existing.name === s.name)
            ).map((skill) =>
            <button
              key={skill.name}
              onClick={() => setSelectedNewSkill(skill.name)}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all min-h-[80px] justify-center ${selectedNewSkill === skill.name ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}>
              
                  <span className="text-2xl mb-1">{skill.icon}</span>
                  <span className="text-xs font-medium text-text-primary text-center">
                    {skill.name}
                  </span>
                </button>
            )}
            </div>

            {/* Level Selection */}
            {selectedNewSkill &&
          <>
                <p className="text-sm font-medium text-text-secondary mb-3">
                  Experience Level
                </p>
                <div className="flex gap-2 mb-6">
                  {(['beginner', 'intermediate', 'expert'] as const).map(
                (level) =>
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all min-h-[48px] ${selectedLevel === level ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary'}`}>
                  
                        {LEVEL_CONFIG[level].label}
                      </button>

              )}
                </div>
              </>
          }

            <ActionButton onClick={addSkill} disabled={!selectedNewSkill}>
              Add Skill
            </ActionButton>
          </div>
        </div>
      }
      <div className="p-4 border-t border-border bg-surface flex-shrink-0">
        <ActionButton onClick={handleSave} loading={isSaving} variant="gradient">
          Save Skills
        </ActionButton>
      </div>
    </div>
  );
}
