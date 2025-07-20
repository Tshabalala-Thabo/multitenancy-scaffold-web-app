import * as React from 'react';
import { cn } from '@/lib/utils';
import 'tw-animate-css';

interface AnimationExampleProps {
  className?: string;
}

/**
 * Example component demonstrating the use of tw-animate-css animations
 */
export function AnimationExample({ className }: AnimationExampleProps) {
  const [animation, setAnimation] = React.useState<string>('animate-bounce');
  
  const animations = [
    'animate-bounce',
    'animate-flash',
    'animate-pulse',
    'animate-rubberBand',
    'animate-shakeX',
    'animate-shakeY',
    'animate-headShake',
    'animate-swing',
    'animate-tada',
    'animate-wobble',
    'animate-jello',
    'animate-heartBeat',
  ];

  const handleChangeAnimation = () => {
    const randomIndex = Math.floor(Math.random() * animations.length);
    setAnimation(animations[randomIndex]);
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className={cn('p-6 bg-blue-100 rounded-lg', animation)}>
        <span className="text-lg font-bold">Animated Element</span>
      </div>
      <button
        onClick={handleChangeAnimation}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Change Animation
      </button>
    </div>
  );
}