import React, { useState } from 'react';
import { StarIcon } from 'lucide-react';
interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}
export function RatingStars({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRate,
  className = ''
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-10 h-10'
  };
  const currentRating = interactive && hoverRating > 0 ? hoverRating : rating;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= currentRating;
        const isHalf = !isFilled && starValue - 0.5 <= currentRating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer touch-target -m-2 p-2' : 'cursor-default'} transition-transform active:scale-90`}
            onClick={() => interactive && onRate && onRate(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            aria-label={`Rate ${starValue} stars`}>
            
            <StarIcon
              className={`${sizes[size]} ${isFilled ? 'fill-secondary text-secondary' : isHalf ? 'fill-secondary/50 text-secondary' : 'fill-transparent text-border'}`} />
            
          </button>);

      })}
    </div>);

}