import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTheme } from '../theme.tsx';

type ThemeToggleProps = {
  className?: string;
  variant?: 'pill' | 'icon';
};

/**
 * Interactive Dark/Light mode switch button.
 * Default is Light mode. Saves preference to localStorage.
 */
export default function ThemeToggle({ className, variant = 'pill' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          className
        )}
      >
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ scale: 0.6, rotate: isDark ? -90 : 90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {isDark ? (
            <Sun size={18} className="text-primary" />
          ) : (
            <Moon size={18} className="text-primary" />
          )}
        </motion.div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border border-border/80 bg-secondary/80 p-0.5 transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className
      )}
    >
      <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
      
      {/* Sliding Active Pill */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={cn(
          'absolute h-[26px] w-[26px] rounded-full bg-card shadow-sm border border-border/70',
          isDark ? 'left-[calc(100%-28px)]' : 'left-[2px]'
        )}
      />

      {/* Sun Icon (Light) */}
      <span
        className={cn(
          'relative z-10 flex h-[26px] w-[26px] items-center justify-center transition-colors duration-200',
          !isDark ? 'text-primary' : 'text-muted-foreground/70'
        )}
      >
        <Sun size={13} strokeWidth={2.2} />
      </span>

      {/* Moon Icon (Dark) */}
      <span
        className={cn(
          'relative z-10 flex h-[26px] w-[26px] items-center justify-center transition-colors duration-200',
          isDark ? 'text-primary' : 'text-muted-foreground/70'
        )}
      >
        <Moon size={13} strokeWidth={2.2} />
      </span>
    </button>
  );
}
