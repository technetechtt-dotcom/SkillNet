import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, XIcon } from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ActionButton } from '../components/ui/ActionButton';
interface StoriesProps {
  onBack: () => void;
  onProfileClick: (workerId: string) => void;
}
const MOCK_STORIES = [
{
  id: 's1',
  userId: 'w1',
  userName: 'Kwame Mensah',
  userAvatar: 'https://i.pravatar.cc/150?u=kwame',
  skill: 'Mechanic',
  image:
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  text: 'Just finished a complex engine repair 🔧',
  timestamp: '2h ago'
},
{
  id: 's2',
  userId: 'w2',
  userName: 'Amara Okafor',
  userAvatar: 'https://i.pravatar.cc/150?u=amara',
  skill: 'Electrician',
  image:
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  text: 'Installing solar panels today ☀️⚡',
  timestamp: '4h ago'
},
{
  id: 's3',
  userId: 'w3',
  userName: 'Thabo Molefe',
  userAvatar: 'https://i.pravatar.cc/150?u=thabo',
  skill: 'Carpenter',
  image:
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  text: 'Custom dining table coming together 🪚',
  timestamp: '6h ago'
},
{
  id: 's4',
  userId: 'w4',
  userName: 'Zainab Mwangi',
  userAvatar: 'https://i.pravatar.cc/150?u=zainab',
  skill: 'Chef',
  image:
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  text: 'Catering for 100 guests today! 👨‍🍳',
  timestamp: '8h ago'
},
{
  id: 's5',
  userId: 'w5',
  userName: 'Kofi Asante',
  userAvatar: 'https://i.pravatar.cc/150?u=kofi',
  skill: 'Farmer',
  image:
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  text: 'Fresh harvest from the organic farm 🌾',
  timestamp: '10h ago'
}];

export function Stories({ onBack, onProfileClick }: StoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const currentStory = MOCK_STORIES[currentIndex];
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (currentIndex < MOCK_STORIES.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            onBack();
          }
          return 0;
        }
        return prev + 100 / 30; // 3 seconds = 30 ticks at 100ms
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex, onBack]);
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleNext = () => {
    if (currentIndex < MOCK_STORIES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onBack();
    }
  };
  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-2">
        {MOCK_STORIES.map((_, index) =>
        <div
          key={index}
          className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
          
            <div
            className="h-full bg-white rounded-full transition-all duration-100"
            style={{
              width:
              index === currentIndex ?
              `${progress}%` :
              index < currentIndex ?
              '100%' :
              '0%'
            }} />
          
          </div>
        )}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar
            src={currentStory.userAvatar}
            name={currentStory.userName}
            size="sm"
            className="ring-2 ring-white" />
          
          <div>
            <h3 className="text-white font-bold text-sm drop-shadow-md">
              {currentStory.userName}
            </h3>
            <p className="text-white/80 text-xs drop-shadow-md">
              {currentStory.timestamp}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white">
          
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Story Image */}
      <img
        src={currentStory.image}
        alt={currentStory.text}
        className="absolute inset-0 w-full h-full object-cover" />
      

      {/* Gradients */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />

      {/* Tap Areas */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
        aria-label="Previous story" />
      
      <button
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
        aria-label="Next story" />
      

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
        <p className="text-white text-xl font-bold mb-4 drop-shadow-lg">
          {currentStory.text}
        </p>
        <div className="flex items-center gap-3">
          <span className="bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {currentStory.skill}
          </span>
          <ActionButton
            onClick={() => onProfileClick(currentStory.userId)}
            variant="gradient"
            size="sm"
            fullWidth={false}
            className="flex-1 shadow-lg">
            
            View Profile
          </ActionButton>
        </div>
      </div>
    </div>);

}