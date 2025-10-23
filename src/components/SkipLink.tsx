import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href?: string;
  children?: string;
  className?: string;
}

export function SkipLink({
  href = '#main-content',
  children = 'Skip to main content',
  className
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only',
        'fixed top-4 left-4 z-[9999]',
        'bg-primary text-primary-foreground',
        'px-6 py-3 rounded-lg',
        'font-medium text-sm',
        'shadow-xl border-2 border-primary-foreground/20',
        'focus:outline-none focus:ring-4 focus:ring-primary/50',
        'transition-all duration-200',
        'hover:bg-primary/90',
        className
      )}
    >
      {children}
    </a>
  );
}
