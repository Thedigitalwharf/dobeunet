import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { User } from '@supabase/supabase-js';

interface IntercomManagerProps {
  user: User | null;
}

const SALES_APP_ID = 'xu0gfiqb';

export function IntercomManager({ user }: IntercomManagerProps) {
  useEffect(() => {
    if (!user) {
      Intercom({
        app_id: SALES_APP_ID,
        custom_launcher_selector: '.intercom-launcher',
        hide_default_launcher: false,
        alignment: 'right',
        horizontal_padding: 20,
        vertical_padding: 20,
      });
    } else {
      Intercom({
        app_id: SALES_APP_ID,
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email || 'User',
        email: user.email || '',
        created_at: Math.floor(new Date(user.created_at).getTime() / 1000),
        custom_launcher_selector: '.intercom-launcher',
        hide_default_launcher: false,
        alignment: 'right',
        horizontal_padding: 20,
        vertical_padding: 20,
      });
    }

    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [user]);

  return null;
}

declare global {
  interface Window {
    Intercom: any;
  }
}
