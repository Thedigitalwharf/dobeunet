import { createContext, useState, useCallback, ReactNode } from 'react';
import type { AnnouncementPriority } from '@/hooks/useAnnouncement';

interface LiveRegionContextType {
  announce: (message: string, priority?: AnnouncementPriority) => void;
}

export const LiveRegionContext = createContext<LiveRegionContextType | null>(null);

interface LiveRegionProviderProps {
  children: ReactNode;
}

export function LiveRegionProvider({ children }: LiveRegionProviderProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      setTimeout(() => setAssertiveMessage(message), 100);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 100);
    }

    setTimeout(() => {
      if (priority === 'assertive') {
        setAssertiveMessage('');
      } else {
        setPoliteMessage('');
      }
    }, 3000);
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </LiveRegionContext.Provider>
  );
}
