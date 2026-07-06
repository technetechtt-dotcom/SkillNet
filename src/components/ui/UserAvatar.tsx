import React from 'react';
interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  verified?: boolean;
  className?: string;
}
export function UserAvatar({
  src,
  name,
  size = 'md',
  isOnline,
  verified,
  className = ''
}: UserAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl'
  };
  const statusSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  };
  const getInitials = (name: string) => {
    return name.
    split(' ').
    map((n) => n[0]).
    join('').
    substring(0, 2).
    toUpperCase();
  };
  // Generate a consistent background color based on name
  const getBgColor = (name: string) => {
    const colors = [
    'bg-blue-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-violet-500',
    'bg-rose-500'];

    const index = name.length % colors.length;
    return colors[index];
  };
  const verifiedRing = verified ?
  'ring-2 ring-primary ring-offset-2 ring-offset-surface' :
  '';
  return (
    <div className={`relative inline-block ${className}`}>
      {src ?
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-border ${verifiedRing}`} /> :


      <div
        className={`${sizes[size]} rounded-full ${getBgColor(name)} flex items-center justify-center text-white font-bold border border-border ${verifiedRing}`}>

          {getInitials(name)}
        </div>
      }

      {isOnline &&
      <span
        className={`absolute bottom-0 right-0 block rounded-full bg-success ring-2 ring-surface ${statusSizes[size]}`}
        aria-label="Online" />

      }
    </div>);

}