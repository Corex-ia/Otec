'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/data';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CorporateHeader } from './header';
import { CorporateFooter } from './footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      try {
        const profile = await getProfile(userId);
        setProfile(profile);
      } catch {
        setProfile(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [setSession, setProfile, setLoading]);

  return (
    <>
      <CorporateHeader />
      <main className="min-h-screen">{children}</main>
      <CorporateFooter />
    </>
  );
}
