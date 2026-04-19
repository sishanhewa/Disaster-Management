import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/endpoints';

export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  phone?: string;
  roles: string[];
  unitTemp?: string;
  unitWind?: string;
  unitPrecip?: string;
  language?: string;
  theme?: string;
  notifEmail?: boolean;
  notifPush?: boolean;
  notifInapp?: boolean;
  dndStart?: string;
  dndEnd?: string;
}

interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
}

interface AuthActions {
  setAuth: (user: UserDto, accessToken: string) => void;
  setUser: (user: UserDto) => void;
  setToken: (accessToken: string) => void;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),
      
      setUser: (user) => set({ user }),
      
      setToken: (accessToken) => set({ accessToken }),
      
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout failed', error);
        } finally {
          set({ user: null, accessToken: null });
          window.location.href = '/login';
        }
      },
      
      isAdmin: () => {
        const user = get().user;
        return user ? user.roles.includes('admin') : false;
      },
      
      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'cs-auth-user',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);
