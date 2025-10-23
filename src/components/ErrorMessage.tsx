import { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnnouncement } from '@/hooks/useAnnouncement';

interface ErrorMessageProps {
  id?: string;
  error?: string;
  className?: string;
  announce?: boolean;
  icon?: boolean;
}

export function ErrorMessage({
  id,
  error,
  className,
  announce = true,
  icon = true
}: ErrorMessageProps) {
  const { announce: announceToSR } = useAnnouncement();
  const previousError = useRef<string>();

  useEffect(() => {
    if (error && announce && error !== previousError.current) {
      announceToSR(`Error: ${error}`, 'assertive');
      previousError.current = error;
    }
  }, [error, announce, announceToSR]);

  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      aria-live="assertive"
      className={cn(
        'text-sm text-destructive flex items-start gap-2 mt-1.5',
        className
      )}
    >
      {icon && <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />}
      <span>{error}</span>
    </p>
  );
}

interface FormErrorSummaryProps {
  errors: Record<string, string>;
  title?: string;
  className?: string;
}

export function FormErrorSummary({
  errors,
  title = 'Please correct the following errors:',
  className
}: FormErrorSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([, error]) => error);
  const { announce } = useAnnouncement();

  useEffect(() => {
    if (errorEntries.length > 0) {
      const errorCount = errorEntries.length;
      const message = `Form has ${errorCount} error${errorCount !== 1 ? 's' : ''}. ${title}`;
      announce(message, 'assertive');
    }
  }, [errorEntries.length, title, announce]);

  if (errorEntries.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'p-4 border-l-4 border-destructive bg-destructive/10 rounded-lg',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-destructive mb-2">
            {title}
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errorEntries.map(([field, error]) => (
              <li key={field} className="text-sm text-destructive">
                {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
