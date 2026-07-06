import React from 'react';
import { CheckIcon } from 'lucide-react';
interface SkillTagProps {
  name: string;
  level?: 'beginner' | 'intermediate' | 'expert';
  icon?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function SkillTag({
  name,
  level,
  icon,
  selectable = false,
  selected = false,
  onSelect,
  size = 'md',
  className = ''
}: SkillTagProps) {
  if (selectable) {
    return (
      <button
        onClick={onSelect}
        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 touch-target w-full aspect-square
          ${selected ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-border bg-surface hover:border-primary/50'} ${className}`}
        aria-pressed={selected}>

        {selected &&
        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
            <CheckIcon className="w-3 h-3" />
          </div>
        }
        <span className="text-3xl mb-2 block">{icon}</span>
        <span className="text-sm font-medium text-text-primary text-center leading-tight">
          {name}
        </span>
      </button>);

  }
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  const levelColors = {
    beginner:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    intermediate:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    expert:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  };
  return (
    <div
      className={`inline-flex items-center rounded-full bg-surface border border-border whitespace-nowrap ${sizes[size]} ${className}`}>

      {icon && <span className="mr-1.5">{icon}</span>}
      <span className="font-medium text-text-primary">{name}</span>
      {level &&
      <>
          <span className="mx-1.5 text-border">•</span>
          <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${levelColors[level]}`}>

            {level}
          </span>
        </>
      }
    </div>);

}