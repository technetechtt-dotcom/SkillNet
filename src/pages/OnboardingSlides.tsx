import React, { useState } from 'react';
import { ActionButton } from '../components/ui/ActionButton';
interface OnboardingSlidesProps {
  onComplete: () => void;
}
const SLIDES = [
{
  id: 1,
  icon: '📱',
  title: 'Showcase Your Skills',
  description:
  'Upload short videos of your work to build a digital portfolio and prove your expertise to potential clients.',
  bgGradient: 'bg-gradient-to-br from-teal-400/20 to-cyan-400/20',
  accentColor: 'bg-teal-500'
},
{
  id: 2,
  icon: '💼',
  title: 'Find Opportunities',
  description:
  'Browse local jobs, connect with employers, and get hired for gigs that match your specific skill set.',
  bgGradient: 'bg-gradient-to-br from-orange-400/20 to-amber-400/20',
  accentColor: 'bg-orange-500'
},
{
  id: 3,
  icon: '💰',
  title: 'Get Paid Securely',
  description:
  'Receive payments directly into your SkillNet Wallet. Withdraw to your bank or mobile money instantly.',
  bgGradient: 'bg-gradient-to-br from-violet-400/20 to-purple-400/20',
  accentColor: 'bg-violet-500'
}];

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleNext = () => {
    if (currentSlide === SLIDES.length - 1) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };
  const slide = SLIDES[currentSlide];
  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-end p-4 flex-shrink-0 relative z-10">
        <button
          onClick={onComplete}
          className="text-text-primary font-bold text-sm px-4 py-2 min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95 transition-transform bg-surface/50 backdrop-blur-sm rounded-full">

          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10">
        <div
          className={`relative w-48 h-48 ${slide.bgGradient} rounded-full flex items-center justify-center mb-12 shadow-inner transition-colors duration-500`}>

          <span className="text-8xl drop-shadow-md transform hover:scale-110 transition-transform duration-300">
            {slide.icon}
          </span>

          {/* Decorative floating dots */}
          <div
            className={`absolute top-4 -left-2 w-3 h-3 rounded-full ${slide.accentColor} opacity-60 animate-bounce`}
            style={{
              animationDuration: '3s'
            }} />

          <div
            className={`absolute bottom-8 -right-4 w-4 h-4 rounded-full ${slide.accentColor} opacity-40 animate-pulse`}
            style={{
              animationDuration: '4s'
            }} />

          <div
            className={`absolute -top-6 right-8 w-2 h-2 rounded-full ${slide.accentColor} opacity-80 animate-ping`}
            style={{
              animationDuration: '5s'
            }} />

        </div>

        <h1 className="text-3xl font-black text-text-primary mb-4 leading-tight tracking-tight">
          {slide.title}
        </h1>

        <p className="text-text-secondary text-lg leading-relaxed max-w-[280px] font-medium">
          {slide.description}
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 flex-shrink-0 flex flex-col items-center gap-8 relative z-10">
        {/* Dots */}
        <div className="flex gap-2.5">
          {SLIDES.map((_, index) =>
          <div
            key={index}
            className={`h-2.5 rounded-full transition-all duration-500 ${currentSlide === index ? 'w-8 bg-primary shadow-sm shadow-primary/50' : 'w-2.5 bg-border'}`} />

          )}
        </div>

        <ActionButton
          onClick={handleNext}
          size="lg"
          variant="gradient"
          className="shadow-lg">

          {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </ActionButton>
      </div>
    </div>);

}