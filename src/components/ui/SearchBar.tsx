import React from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFilter?: () => void;
  className?: string;
}
export function SearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  onFilter,
  className = ''
}: SearchBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-text-secondary" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)} />
        
      </div>
      {onFilter &&
      <button
        onClick={onFilter}
        className="p-3.5 bg-surface border border-border rounded-2xl text-text-secondary hover:text-primary hover:border-primary transition-colors touch-target flex-shrink-0"
        aria-label="Filter results">
        
          <FilterIcon className="h-5 w-5" />
        </button>
      }
    </div>);

}