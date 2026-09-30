import { api } from "@/lib/api";
import { UserProfile } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  fetchProfile: async () => {
    try {
      const profile = await api.getProfile();
      set({ user: profile, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    await api.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
