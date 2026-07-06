import React from 'react';
interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}
export function ContentCard({
  children,
  className = '',
  noPadding = false,
  ...props
}: ContentCardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl shadow-card hover:shadow-elevated transition-shadow duration-300 border border-border overflow-hidden ${noPadding ? '' : 'p-4 sm:p-5'} ${className}`}
      {...props}>
      
      {children}
    </div>);

}