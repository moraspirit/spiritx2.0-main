import * as React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';
import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react';

import { cn } from '@/lib/utils';

const cardVariants = cva('absolute will-change-transform contain-paint', {
  variants: {
    variant: {
      dark: 'flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-stone-700/50 bg-accent-foreground/90 p-6',
      // No backdrop-blur: Chrome re-blurs every frame while these cards tilt and slide.
      // Fill stays opaque so the stack still reads as solid glass cards.
      light:
        'flex size-full flex-col items-center justify-center gap-6 rounded-2xl border bg-accent bg-background/95 p-6',
    },
  },
  defaultVariants: {
    variant: 'light',
  },
});

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
}
interface CardStickyProps extends HTMLMotionProps<'div'>, VariantProps<typeof cardVariants> {
  arrayLength: number;
  index: number;
  incrementY?: number;
  incrementZ?: number;
  incrementRotation?: number;
  /**
   * Phones: translateY only — skip rotate / translateZ / drop-shadow.
   * Keeps the sticky stack feel with much less compositing cost.
   */
  lite?: boolean;
}
interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(
  undefined
);
export function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (context === undefined) {
    throw new Error(
      'useContainerScrollContext must be used within a ContainerScrollContextProvider'
    );
  }
  return context;
}

type ContainerScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Skip CSS perspective on phones — 3D stacking is expensive while scrolling. */
  lite?: boolean;
};

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  children,
  style,
  className,
  lite = false,
  ...props
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start center', 'end end'],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn('relative min-h-svh w-full', className)}
        style={lite ? style : { perspective: '1000px', ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};
ContainerScroll.displayName = 'ContainerScroll';

type CardsContainerProps = React.HTMLAttributes<HTMLDivElement> & { lite?: boolean };

export const CardsContainer: React.FC<CardsContainerProps> = ({
  children,
  className,
  style,
  lite = false,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={lite ? style : { perspective: '1000px', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
CardsContainer.displayName = 'CardsContainer';

export const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation = -index + 90,
      className,
      variant,
      style,
      lite = false,
      ...props
    },
    ref
  ) => {
    const { scrollYProgress } = useContainerScrollContext();

    const start = index / (arrayLength + 1);
    const end = (index + 1) / (arrayLength + 1);
    const range = React.useMemo(() => [start, end], [start, end]);
    const rotateRange = [range[0] - 1.5, range[1] / 1.5];

    // The last card never leaves, so the pinned viewport always ends on a card
    // instead of scrolling through an empty stage.
    const y = useTransform(scrollYProgress, range, ['0%', index === arrayLength ? '0%' : '-180%']);
    const rotate = useTransform(scrollYProgress, rotateRange, [incrementRotation, 0]);
    const fullTransform = useMotionTemplate`translateZ(${
      index * incrementZ
    }px) translateY(${y}) rotate(${rotate}deg)`;
    const liteTransform = useMotionTemplate`translateY(${y})`;
    const transform = lite ? liteTransform : fullTransform;

    // Animated drop-shadow filters repaint every scroll frame. A static shadow
    // on the card class is enough and stays smooth while the stack moves.
    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: 'hidden' as const,
      zIndex: (arrayLength - index) * incrementZ,
      ...style,
    };
    return (
      <motion.div
        ref={ref}
        style={cardStyle}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
CardTransformed.displayName = 'CardTransformed';

export const ReviewStars = React.forwardRef<HTMLDivElement, ReviewProps>(
  ({ rating, maxRating = 5, className, ...props }, ref) => {
    const filledStars = Math.floor(rating);
    const fractionalPart = rating - filledStars;
    const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0);

    return (
      <div className={cn('flex items-center gap-2', className)} ref={ref} {...props}>
        <div className="flex items-center">
          {[...Array(filledStars)].map((_, index) => (
            <svg
              key={`filled-${index}`}
              className="size-4 text-inherit"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287 3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
          {fractionalPart > 0 && (
            <svg className="size-4 text-inherit" fill="currentColor" viewBox="0 0 20 20">
              <defs>
                <linearGradient id="half">
                  <stop offset={`${fractionalPart * 100}%`} stopColor="currentColor" />
                  <stop offset={`${fractionalPart * 100}%`} stopColor="rgb(209 213 219)" />
                </linearGradient>
              </defs>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287 3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286 3.957z"
                fill="url(#half)"
              />
            </svg>
          )}
          {[...Array(emptyStars)].map((_, index) => (
            <svg
              key={`empty-${index}`}
              className="size-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287 3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286 3.957z" />
            </svg>
          ))}
        </div>
        <p className="sr-only">{rating}</p>
      </div>
    );
  }
);
ReviewStars.displayName = 'ReviewStars';
