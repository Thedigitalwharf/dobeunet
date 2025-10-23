import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AnalyticsEvent {
  event_type: string;
  page_url?: string;
  user_id?: string;
  session_id: string;
  properties?: Record<string, any>;
}

interface PageView {
  page_url: string;
  user_id?: string;
  session_id: string;
  referrer?: string;
  time_on_page?: number;
}

export const useAnalytics = (user: User | null) => {
  const sessionId = useRef<string>();
  const pageStartTime = useRef<number>(Date.now());
  const lastPageUrl = useRef<string>('');

  useEffect(() => {
    // Generate session ID
    sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const trackEvent = async (eventType: string, properties?: Record<string, any>) => {
    if (!sessionId.current) return;

    try {
      // Log to console in development for debugging
      if (import.meta.env.DEV) {
        console.log('[Analytics Event]', eventType, properties);
      }
      // Analytics edge function disabled - can be re-enabled when needed
      // await supabase.functions.invoke('track-analytics', { body: event });
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
    }
  };

  const trackPageView = async (url?: string) => {
    if (!sessionId.current) return;

    const currentUrl = url || window.location.pathname;
    const now = Date.now();

    // Track time on previous page
    if (lastPageUrl.current && lastPageUrl.current !== currentUrl) {
      const timeOnPage = now - pageStartTime.current;

      if (import.meta.env.DEV) {
        console.log('[Analytics Page View]', lastPageUrl.current, 'Time:', Math.round(timeOnPage / 1000), 's');
      }
      // Analytics edge function disabled - can be re-enabled when needed
    }

    // Track new page view
    if (import.meta.env.DEV) {
      console.log('[Analytics Page View]', currentUrl);
    }
    // Analytics edge function disabled - can be re-enabled when needed

    lastPageUrl.current = currentUrl;
    pageStartTime.current = now;
  };

  // Auto-track page views
  useEffect(() => {
    trackPageView();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackPageView();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  // Track common interactions
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        trackEvent('scroll_depth', { scroll_percent: scrollPercent });
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.closest('a');
        trackEvent('link_click', {
          url: link?.href,
          text: link?.textContent?.trim(),
          external: link?.hostname !== window.location.hostname
        });
      } else if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.closest('button');
        trackEvent('button_click', {
          text: button?.textContent?.trim(),
          type: button?.type
        });
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 1000);
    };

    window.addEventListener('scroll', throttledScroll);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      document.removeEventListener('click', handleClick);
      clearTimeout(scrollTimeout);
    };
  }, [user]);

  return {
    trackEvent,
    trackPageView,
    sessionId: sessionId.current
  };
};