import React from 'react';
interface FilterChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}
export function FilterChip({ label, selected, onToggle }: FilterChipProps) {
  return (
    <button
      onClick={onToggle}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target min-h-[40px]
        ${selected ? 'bg-primary text-white border border-primary' : 'bg-surface text-text-secondary border border-border hover:border-primary/50'}`}
      aria-pressed={selected}>

      {label}
    </button>);

}