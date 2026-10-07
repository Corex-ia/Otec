import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface AuthStore {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  isAdmin: () => boolean;
  isCRMUser: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  isAdmin: () => {
    const profile = get().profile;
    return profile?.role === 'admin';
  },

  isCRMUser: () => {
    const profile = get().profile;
    return ['admin', 'ejecutivo', 'vendedor'].includes(profile?.role || '');
  },
}));
