import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { UserAvatar } from '../components/ui/UserAvatar';
interface SkillChallengesProps {
  onBack: () => void;
}
const ACTIVE_CHALLENGE = {
  id: 'ch1',
  name: '#FastestWire',
  emoji: '⚡',
  description: 'Show your fastest wiring job! Top 3 win badges.',
  category: 'Electrician',
  participants: 142,
  daysLeft: 3,
  prize: 'Verified Badge + ₦50k'
};
const CHALLENGES = [
{
  id: 'ch2',
  name: '#CleanestCut',
  emoji: '🪚',
  category: 'Carpentry',
  status: 'completed',
  participants: 89,
  winners: [
  {
    name: 'Thabo M.',
    avatar: 'https://i.pravatar.cc/150?u=thabo'
  },
  {
    name: 'Grace W.',
    avatar: 'https://i.pravatar.cc/150?u=grace'
  },
  {
    name: 'Kofi A.',
    avatar: 'https://i.pravatar.cc/150?u=kofi'
  }]

},
{
  id: 'ch3',
  name: '#PipeMaster',
  emoji: '🔧',
  category: 'Plumbing',
  status: 'active',
  participants: 67,
  daysLeft: 2
},
{
  id: 'ch4',
  name: '#GreenThumb',
  emoji: '🌱',
  category: 'Farming',
  status: 'upcoming',
  participants: 0,
  startsIn: 5
},
{
  id: 'ch5',
  name: '#SpeedBuild',
  emoji: '🏗️',
  category: 'Construction',
  status: 'completed',
  participants: 124,
  winners: [
  {
    name: 'David O.',
    avatar: 'https://i.pravatar.cc/150?u=david'
  },
  {
    name: 'Amara O.',
    avatar: 'https://i.pravatar.cc/150?u=amara'
  },
  {
    name: 'Kwame M.',
    avatar: 'https://i.pravatar.cc/150?u=kwame'
  }]

}];

export function SkillChallenges({ onBack }: SkillChallengesProps) {
  const [joined, setJoined] = useState(false);
  const handleJoin = () => {
    setJoined(true);
    setTimeout(() => setJoined(false), 3000);
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-secondary" />
          <h1 className="text-lg font-bold text-text-primary">
            Skill Challenges
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Featured Active Challenge */}
        <div className="bg-gradient-to-br from-secondary/20 via-amber-500/10 to-orange-500/20 rounded-3xl p-6 border border-secondary/30 shadow-glow relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-4xl">{ACTIVE_CHALLENGE.emoji}</span>
              <div>
                <h2 className="text-2xl font-black text-text-primary">
                  {ACTIVE_CHALLENGE.name}
                </h2>
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Featured Challenge
                </p>
              </div>
            </div>

            <p className="text-text-secondary font-medium mb-4">
              {ACTIVE_CHALLENGE.description}
            </p>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1.5">
                <UsersIcon className="w-4 h-4 text-primary" />
                <span className="font-bold text-text-primary">
                  {ACTIVE_CHALLENGE.participants}
                </span>
                <span className="text-text-secondary">joined</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-error" />
                <span className="font-bold text-error">
                  {ACTIVE_CHALLENGE.daysLeft} days left
                </span>
              </div>
            </div>

            <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-border/50">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                Prize
              </p>
              <p className="text-lg font-black text-primary">
                {ACTIVE_CHALLENGE.prize}
              </p>
            </div>

            {joined ?
            <div className="bg-success/10 border border-success/20 rounded-2xl py-4 flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircleIcon className="w-5 h-5 text-success" />
                <span className="font-bold text-success">
                  You're in! Start posting videos with {ACTIVE_CHALLENGE.name}
                </span>
              </div> :

            <ActionButton
              onClick={handleJoin}
              variant="gradient"
              className="shadow-lg">
              
                Join Challenge
              </ActionButton>
            }
          </div>
        </div>

        {/* All Challenges */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            All Challenges
          </h2>
          <div className="space-y-3">
            {CHALLENGES.map((challenge) =>
            <div
              key={challenge.id}
              className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
              
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{challenge.emoji}</span>
                    <div>
                      <h3 className="font-bold text-text-primary">
                        {challenge.name}
                      </h3>
                      <p className="text-xs text-text-secondary font-medium">
                        {challenge.category}
                      </p>
                    </div>
                  </div>
                  <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${challenge.status === 'completed' ? 'bg-success/10 text-success' : challenge.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-border text-text-secondary'}`}>
                  
                    {challenge.status === 'completed' ?
                  'Completed' :
                  challenge.status === 'active' ?
                  `${challenge.daysLeft}d left` :
                  `Starts in ${challenge.startsIn}d`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <UsersIcon className="w-4 h-4" />
                    <span className="font-medium">
                      {challenge.participants} participants
                    </span>
                  </div>

                  {challenge.winners &&
                <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-text-secondary mr-1">
                        Winners:
                      </span>
                      {challenge.winners.map((winner, i) =>
                  <UserAvatar
                    key={i}
                    src={winner.avatar}
                    name={winner.name}
                    size="sm"
                    className="-ml-2 first:ml-0 ring-2 ring-surface" />

                  )}
                    </div>
                }
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>);

}