import React, { useState } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { UserAvatar } from '../components/ui/UserAvatar';
import { RatingStars } from '../components/ui/RatingStars';
import { ActionButton } from '../components/ui/ActionButton';
interface RatingReviewProps {
  onBack: () => void;
}
const FEEDBACK_CHIPS = [
'Professional',
'On Time',
'Quality Work',
'Friendly',
'Recommended'];

export function RatingReview({ onBack }: RatingReviewProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
    prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };
  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">⭐</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Thank You!
        </h2>
        <p className="text-text-secondary mb-8">
          Your review helps build trust in the SkillNet community.
        </p>
        <ActionButton onClick={onBack} fullWidth={false} className="px-12">
          Done
        </ActionButton>
      </div>);

  }
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center">
          
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-text-primary">
          Rate Your Experience
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Worker Info */}
        <div className="flex flex-col items-center text-center mb-8">
          <UserAvatar
            name="TechHub Ltd"
            src="https://i.pravatar.cc/150?u=techhub"
            size="xl" />
          
          <h2 className="text-xl font-bold text-text-primary mt-4">
            TechHub Ltd
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Plumbing Repair — Completed
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex flex-col items-center mb-8">
          <p className="text-sm font-medium text-text-secondary mb-4">
            How was your experience?
          </p>
          <RatingStars
            rating={rating}
            size="xl"
            interactive
            onRate={setRating} />
          
          {rating > 0 &&
          <p className="text-sm text-primary font-semibold mt-3">
              {rating === 5 ?
            'Excellent!' :
            rating === 4 ?
            'Great!' :
            rating === 3 ?
            'Good' :
            rating === 2 ?
            'Fair' :
            'Poor'}
            </p>
          }
        </div>

        {/* Quick Feedback Chips */}
        <div className="mb-6">
          <p className="text-sm font-medium text-text-secondary mb-3">
            Quick feedback
          </p>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_CHIPS.map((chip) =>
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors min-h-[44px] ${selectedChips.includes(chip) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-secondary'}`}>
              
                {chip}
              </button>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Write a review (optional)
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience working with this employer..."
            rows={4}
            className="w-full bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary text-base resize-none" />
          
        </div>

        <ActionButton
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={rating === 0}>
          
          Submit Review
        </ActionButton>
      </div>
    </div>);

}