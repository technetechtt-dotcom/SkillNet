import React from 'react';
import { Loader2Icon } from 'lucide-react';
interface ActionButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}
export function ActionButton({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  loading = false,
  disabled,
  icon,
  className = '',
  ...props
}: ActionButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none touch-target';
  const variants = {
    primary:
    'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20',
    secondary:
    'bg-secondary text-white hover:bg-secondary-dark shadow-md shadow-secondary/20',
    gradient:
    'bg-gradient-to-r from-primary to-teal-500 text-white shadow-glow hover:shadow-lg hover:shadow-primary/30',
    outline:
    'border-2 border-primary text-primary hover:bg-primary-light dark:hover:bg-primary-dark/20',
    ghost: 'text-text-secondary hover:bg-surface hover:text-text-primary'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading ?
      <Loader2Icon className="w-5 h-5 mr-2 animate-spin" /> :
      icon ?
      <span className="mr-2">{icon}</span> :
      null}
      {children}
    </button>);

}