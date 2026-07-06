import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  RefreshCwIcon,
  PlusIcon,
  CheckCircleIcon } from
'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { UserAvatar } from '../components/ui/UserAvatar';
import { ContentCard } from '../components/ui/ContentCard';
import { SkillTag } from '../components/ui/SkillTag';
interface SkillSwapProps {
  onBack: () => void;
}
const AVAILABLE_SWAPS = [
{
  id: 's1',
  user: {
    name: 'Amara Okafor',
    avatar: 'https://i.pravatar.cc/150?u=amara',
    location: '2.5km away'
  },
  offers: 'Electrical Wiring',
  needs: 'Engine Repair',
  repPoints: 15
},
{
  id: 's2',
  user: {
    name: 'Thabo Molefe',
    avatar: 'https://i.pravatar.cc/150?u=thabo',
    location: '4.1km away'
  },
  offers: 'Custom Furniture',
  needs: 'Plumbing Fix',
  repPoints: 20
},
{
  id: 's3',
  user: {
    name: 'Zainab Mwangi',
    avatar: 'https://i.pravatar.cc/150?u=zainab',
    location: '1.2km away'
  },
  offers: 'Catering for 50',
  needs: 'House Painting',
  repPoints: 25
},
{
  id: 's4',
  user: {
    name: 'Kofi Asante',
    avatar: 'https://i.pravatar.cc/150?u=kofi',
    location: '5.0km away'
  },
  offers: 'Organic Produce',
  needs: 'Solar Installation',
  repPoints: 10
}];

export function SkillSwap({ onBack }: SkillSwapProps) {
  const [myNeeds, setMyNeeds] = useState(['Plumbing', 'Electrical']);
  const [posted, setPosted] = useState(false);
  const [proposedSwaps, setProposedSwaps] = useState<string[]>([]);
  const [showAddNeed, setShowAddNeed] = useState(false);
  const [newNeed, setNewNeed] = useState('');
  const handlePostSwap = () => {
    setPosted(true);
  };
  const handleProposeSwap = (id: string) => {
    setProposedSwaps((prev) => [...prev, id]);
  };
  const handleAddNeed = () => {
    if (newNeed.trim()) {
      setMyNeeds((prev) => [...prev, newNeed.trim()]);
      setNewNeed('');
      setShowAddNeed(false);
    }
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
              SkillSwap <RefreshCwIcon className="w-5 h-5 text-primary" />
            </h1>
            <p className="text-xs text-text-secondary font-medium">
              Trade skills, zero cash needed
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-3 flex justify-center items-center gap-2 border border-primary/20">
          <CheckCircleIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-text-primary">
            12 swaps completed · 180 rep points earned
          </span>
        </div>

        {/* My Offer Card */}
        <ContentCard className="border-primary/30 shadow-glow">
          <h2 className="text-base font-bold text-text-primary mb-4">
            My Swap Profile
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                I can offer:
              </p>
              <div className="flex flex-wrap gap-2">
                <SkillTag
                  name="Mechanic"
                  size="md"
                  className="bg-primary/10 text-primary-dark border-none" />
                
                <SkillTag
                  name="Driver"
                  size="md"
                  className="bg-primary/10 text-primary-dark border-none" />
                
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                I need:
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                {myNeeds.map((need) =>
                <SkillTag
                  key={need}
                  name={need}
                  size="md"
                  className="bg-secondary/10 text-secondary-dark border-none" />

                )}
                {!showAddNeed ?
                <button
                  onClick={() => setShowAddNeed(true)}
                  className="w-8 h-8 rounded-full bg-surface border border-dashed border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors">
                  
                    <PlusIcon className="w-4 h-4" />
                  </button> :

                <div className="flex items-center gap-2">
                    <input
                    type="text"
                    value={newNeed}
                    onChange={(e) => setNewNeed(e.target.value)}
                    placeholder="e.g. Painting"
                    className="text-sm bg-background border border-border rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:border-primary"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNeed()} />
                  
                    <button
                    onClick={handleAddNeed}
                    className="text-primary font-bold text-sm">
                    
                      Add
                    </button>
                    <button
                    onClick={() => setShowAddNeed(false)}
                    className="text-text-secondary text-sm">
                    
                      Cancel
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>

          {posted ?
          <div className="mt-6 bg-success/10 border border-success/20 rounded-xl p-4 text-center animate-fade-in">
              <p className="text-sm font-bold text-success-dark dark:text-success mb-3">
                ✅ Swap request posted! You'll be notified when someone matches.
              </p>
              <button
              onClick={() => setPosted(false)}
              className="text-xs font-bold text-text-secondary hover:text-text-primary">
              
                Post Another
              </button>
            </div> :

          <ActionButton
            onClick={handlePostSwap}
            size="md"
            variant="gradient"
            className="mt-6">
            
              Post Swap Request
            </ActionButton>
          }
        </ContentCard>

        {/* Available Swaps */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Available Swaps Near You
          </h2>
          <div className="space-y-4">
            {AVAILABLE_SWAPS.map((swap) =>
            <ContentCard
              key={swap.id}
              className="relative overflow-hidden group hover:border-primary/50 transition-colors">
              
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-secondary" />

                <div className="flex items-center justify-between mb-4 pl-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                    src={swap.user.avatar}
                    name={swap.user.name}
                    size="md" />
                  
                    <div>
                      <h3 className="font-bold text-sm text-text-primary">
                        {swap.user.name}
                      </h3>
                      <p className="text-xs text-text-secondary font-medium">
                        {swap.user.location}
                      </p>
                    </div>
                  </div>
                  <div className="bg-accent/10 text-accent px-2 py-1 rounded-lg text-xs font-bold">
                    +{swap.repPoints} rep
                  </div>
                </div>

                <div className="bg-background rounded-xl p-3 flex items-center justify-between mb-4 ml-2 border border-border/50">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                      Offers
                    </p>
                    <p className="text-sm font-bold text-primary-dark">
                      {swap.offers}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface shadow-sm flex items-center justify-center mx-2 flex-shrink-0 z-10 border border-border">
                    <RefreshCwIcon className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                      Needs
                    </p>
                    <p className="text-sm font-bold text-secondary-dark">
                      {swap.needs}
                    </p>
                  </div>
                </div>

                <div className="pl-2">
                  <ActionButton
                  onClick={() => handleProposeSwap(swap.id)}
                  disabled={proposedSwaps.includes(swap.id)}
                  size="sm"
                  variant={
                  proposedSwaps.includes(swap.id) ? 'ghost' : 'outline'
                  }
                  className={`w-full transition-colors ${proposedSwaps.includes(swap.id) ? 'bg-success/10 text-success-dark dark:text-success border-none opacity-100' : 'group-hover:bg-primary group-hover:text-white group-hover:border-primary'}`}>
                  
                    {proposedSwaps.includes(swap.id) ?
                  'Proposed ✓' :
                  'Propose Swap'}
                  </ActionButton>
                </div>
              </ContentCard>
            )}
          </div>
        </div>

        {/* Completed Swaps */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Recently Completed
          </h2>
          <div className="space-y-3">
            {[1, 2].map((i) =>
            <div
              key={i}
              className="bg-surface rounded-2xl p-3 border border-border flex items-center gap-3 opacity-70">
              
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">
                    Engine Repair ⇄ Plumbing Fix
                  </p>
                  <p className="text-xs text-text-secondary">
                    Completed with David O. • 2 days ago
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>);

}