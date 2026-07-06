import React from 'react';
import {
  ArrowLeftIcon,
  MapPinIcon,
  ShieldIcon,
  StarIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  BriefcaseIcon } from
'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { SkillTag } from '../components/ui/SkillTag';
import { ActionButton } from '../components/ui/ActionButton';
import { RatingStars } from '../components/ui/RatingStars';
import { EndorsementsSection } from '../components/EndorsementsSection';
interface WorkerProfileProps {
  workerId: string;
  onBack: () => void;
  onMessage: () => void;
  onHire: () => void;
}
const WORKERS: Record<
  string,
  {
    name: string;
    location: string;
    bio: string;
    trustScore: number;
    jobsDone: number;
    rating: number;
    avatar: string;
    skills: {
      name: string;
      icon?: string;
      level: 'beginner' | 'intermediate' | 'expert';
    }[];
    reviews: {
      name: string;
      rating: number;
      text: string;
      date: string;
    }[];
  }> =
{
  default: {
    name: 'Amara Okafor',
    location: 'Lagos, Nigeria',
    bio: 'Certified electrician with 5 years of experience in residential and commercial wiring. Safety is my number one priority.',
    trustScore: 98,
    jobsDone: 120,
    rating: 4.9,
    avatar: 'https://i.pravatar.cc/150?u=amara',
    skills: [
    {
      name: 'Electrician',
      icon: '⚡',
      level: 'expert'
    },
    {
      name: 'Wiring',
      level: 'expert'
    },
    {
      name: 'Solar Installation',
      level: 'intermediate'
    }],

    reviews: [
    {
      name: 'David Omondi',
      rating: 5,
      text: 'Amara did a fantastic job rewiring my entire apartment. Very professional and clean work.',
      date: '1 week ago'
    },
    {
      name: 'TechHub Ltd',
      rating: 5,
      text: 'Hired for office maintenance. Always on time and fixes issues perfectly.',
      date: '1 month ago'
    }]

  },
  w2: {
    name: 'Thabo Molefe',
    location: 'Cape Town, South Africa',
    bio: 'Master carpenter specializing in custom furniture and home renovations. 7 years of craftsmanship.',
    trustScore: 90,
    jobsDone: 35,
    rating: 4.7,
    avatar: 'https://i.pravatar.cc/150?u=thabo',
    skills: [
    {
      name: 'Carpenter',
      icon: '🪚',
      level: 'expert'
    },
    {
      name: 'Furniture',
      level: 'expert'
    },
    {
      name: 'Renovation',
      level: 'intermediate'
    }],

    reviews: [
    {
      name: 'Grace Wanjiku',
      rating: 5,
      text: 'Beautiful custom dining table. Thabo is a true craftsman!',
      date: '3 days ago'
    },
    {
      name: 'Kofi Asante',
      rating: 4,
      text: 'Good work on the kitchen cabinets. Quality is great.',
      date: '2 weeks ago'
    }]

  },
  w3: {
    name: 'Kwame Mensah',
    location: 'Accra, Ghana',
    bio: 'Professional mechanic with 8 years of experience. Specializing in Toyota and Honda engines.',
    trustScore: 95,
    jobsDone: 42,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=kwame',
    skills: [
    {
      name: 'Mechanic',
      icon: '🔧',
      level: 'expert'
    },
    {
      name: 'Driver',
      icon: '🚗',
      level: 'intermediate'
    },
    {
      name: 'Engine Repair',
      level: 'expert'
    }],

    reviews: [
    {
      name: 'TechHub Ltd',
      rating: 5,
      text: 'Kwame fixed our issue quickly and professionally.',
      date: '2 days ago'
    },
    {
      name: 'Speedy Delivery',
      rating: 5,
      text: 'Excellent fleet maintenance work. Very reliable.',
      date: '1 week ago'
    }]

  },
  e1: {
    name: 'TechHub Ltd',
    location: 'Victoria Island, Lagos',
    bio: 'Leading tech company in Lagos. We hire skilled workers for office maintenance and facility management.',
    trustScore: 98,
    jobsDone: 15,
    rating: 4.8,
    avatar: 'https://i.pravatar.cc/150?u=techhub',
    skills: [],
    reviews: [
    {
      name: 'Kwame Mensah',
      rating: 5,
      text: 'Great employer. Pays on time and communicates clearly.',
      date: '1 week ago'
    }]

  }
};
const getWorker = (id: string) => {
  const worker = WORKERS[id] || WORKERS['default'];
  return {
    id,
    ...worker
  };
};
export function WorkerProfile({
  workerId,
  onBack,
  onMessage,
  onHire
}: WorkerProfileProps) {
  const worker = getWorker(workerId);
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Cover & Header */}
      <div className="relative h-32 bg-gradient-to-br from-secondary via-orange-500 to-red-500 flex-shrink-0">
        <div className="absolute top-4 left-4">
          <button
            onClick={onBack}
            className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-black/40 transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 relative pb-6 bg-surface border-b border-border">
        <div className="absolute -top-12 left-4">
          <UserAvatar
            name={worker.name}
            src={worker.avatar}
            size="xl"
            className="border-4 border-surface shadow-md" />
          
          <div className="absolute bottom-1 right-1 bg-success text-white p-1 rounded-full border-2 border-surface">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="pt-12 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {worker.name}
            </h1>
            <div className="flex items-center gap-1 text-text-secondary mt-1">
              <MapPinIcon className="w-4 h-4" />
              <span className="text-sm">{worker.location}</span>
            </div>
          </div>
          <span className="bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-full border border-success/20">
            Available Now
          </span>
        </div>

        <p className="mt-4 text-text-secondary text-sm leading-relaxed">
          {worker.bio}
        </p>

        {/* Stats */}
        <div className="flex justify-between mt-6 p-4 bg-background rounded-2xl border border-border">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-primary mb-1">
              <ShieldIcon className="w-5 h-5" />
              <span className="font-bold text-lg">{worker.trustScore}</span>
            </div>
            <span className="text-xs text-text-secondary">Trust Score</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <span className="font-bold text-lg text-text-primary mb-1">
              {worker.jobsDone}
            </span>
            <span className="text-xs text-text-secondary">Jobs Done</span>
          </div>
          <div className="w-px bg-border" />
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-secondary mb-1">
              <StarIcon className="w-5 h-5 fill-secondary" />
              <span className="font-bold text-lg">{worker.rating}</span>
            </div>
            <span className="text-xs text-text-secondary">Rating</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <ActionButton
            variant="outline"
            size="md"
            className="flex-1 border-border text-text-primary hover:bg-background"
            onClick={onMessage}
            icon={<MessageCircleIcon className="w-5 h-5" />}>
            
            Message
          </ActionButton>
          <ActionButton
            variant="gradient"
            size="md"
            className="flex-1 shadow-md"
            onClick={onHire}
            icon={<BriefcaseIcon className="w-5 h-5" />}>
            
            Hire
          </ActionButton>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-surface mt-2 p-5 border-y border-border shadow-sm">
        <h2 className="text-lg font-bold text-text-primary mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {worker.skills.map((skill, i) =>
          <SkillTag
            key={i}
            name={skill.name}
            icon={skill.icon}
            level={skill.level}
            size="lg" />

          )}
        </div>
      </div>

      {/* Endorsements Section */}
      <EndorsementsSection workerId={worker.id} skills={worker.skills} />

      {/* Portfolio Videos */}
      <div className="bg-surface mt-2 p-4 border-y border-border">
        <h2 className="text-lg font-bold text-text-primary mb-4">
          Portfolio Videos
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'].
          map((src, i) =>
          <div
            key={i}
            className="relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden">
            
              <img
              src={src}
              alt={`Portfolio ${i + 1}`}
              className="w-full h-full object-cover" />
            
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                <StarIcon className="w-3 h-3 fill-white" />{' '}
                {(2.4 + i * 0.8).toFixed(1)}k
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-surface mt-2 p-4 border-y border-border pb-8">
        <h2 className="text-lg font-bold text-text-primary mb-4">Reviews</h2>
        {worker.reviews.map((review, i) =>
        <div
          key={i}
          className="mb-4 pb-4 border-b border-border last:border-0 last:mb-0 last:pb-0">
          
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <UserAvatar name={review.name} size="sm" />
                <span className="font-semibold text-sm text-text-primary">
                  {review.name}
                </span>
              </div>
              <span className="text-xs text-text-secondary">{review.date}</span>
            </div>
            <RatingStars rating={review.rating} size="sm" />
            <p className="text-sm text-text-secondary mt-2">{review.text}</p>
          </div>
        )}
      </div>
    </div>);

}