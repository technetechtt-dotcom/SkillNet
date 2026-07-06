import React from 'react';
import { ActionButton } from '../components/ui/ActionButton';
interface OnboardingWelcomeProps {
  onNext: () => void;
  onSignIn?: () => void;
}
export function OnboardingWelcome({
  onNext,
  onSignIn
}: OnboardingWelcomeProps) {
  return (
    <div className="flex flex-col h-full bg-background px-6 py-8 overflow-y-auto relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
        {/* Logo Area */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow transform hover:scale-105 transition-transform duration-300">
            <span className="text-white text-4xl font-black tracking-tighter">
              SN
            </span>
          </div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">
            SkillNet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">
              Africa
            </span>
          </h1>
        </div>

        {/* Illustration */}
        <div className="relative w-full max-w-[260px] aspect-square mb-12">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/10 to-accent/20 rounded-full blur-3xl" />
          <div className="relative w-full h-full bg-surface rounded-full border-4 border-white dark:border-surface shadow-elevated flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="African workers"
              className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700" />
            
          </div>
          <div
            className="absolute top-6 -left-3 bg-surface p-3.5 rounded-2xl shadow-lg animate-bounce"
            style={{
              animationDuration: '3s'
            }}>
            
            <span className="text-2xl">🔧</span>
          </div>
          <div
            className="absolute bottom-12 -right-3 bg-surface p-3.5 rounded-2xl shadow-lg animate-bounce"
            style={{
              animationDuration: '2.5s',
              animationDelay: '0.5s'
            }}>
            
            <span className="text-2xl">⚡</span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-text-primary mb-4 leading-tight">
          Your Skills.
          <br />
          Your Future.
        </h2>
        <p className="text-text-secondary text-lg mb-6 max-w-[280px] font-medium">
          Connect with opportunities and build your digital reputation across
          Africa.
        </p>
      </div>

      <div className="w-full space-y-5 flex-shrink-0 pb-6 relative z-10">
        <ActionButton
          onClick={onNext}
          size="lg"
          variant="gradient"
          className="shadow-lg">
          
          Create Account
        </ActionButton>
        <p className="text-center text-sm text-text-secondary font-medium">
          Already have an account?{' '}
          <button
            onClick={onSignIn}
            className="text-primary font-black p-2 min-h-[44px] hover:text-primary-dark transition-colors">
            
            Sign In
          </button>
        </p>

        <div className="flex justify-center gap-6 pt-6 border-t border-border/50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/30" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Showcase
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-sm shadow-secondary/30" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Find Work
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-sm shadow-accent/30" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Get Paid
            </span>
          </div>
        </div>
      </div>
    </div>);

}