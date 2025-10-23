import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { User } from '@supabase/supabase-js';

interface IntercomChatProps {
  user: User | null;
}

export function IntercomChat({ user }: IntercomChatProps) {
  useEffect(() => {
    if (user) {
      Intercom({
        app_id: 'xu0gfiqb',
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email || 'User',
        email: user.email || '',
        created_at: Math.floor(new Date(user.created_at).getTime() / 1000),
      });
    }
  }, [user]);

  return null;
}
