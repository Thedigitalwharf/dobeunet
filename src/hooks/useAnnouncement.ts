import { useContext } from 'react';
import { LiveRegionContext } from '@/contexts/LiveRegionContext';

export type AnnouncementPriority = 'polite' | 'assertive';

export function useAnnouncement() {
  const context = useContext(LiveRegionContext);

  if (!context) {
    console.warn('useAnnouncement must be used within a LiveRegionProvider');
    return {
      announce: () => {},
    };
  }

  return context;
}
