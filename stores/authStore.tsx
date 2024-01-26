// import { create } from 'zustand';



import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthStore {
  isAuthenticated: boolean;
  username: string;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: '',
      login: (username: string) => set({ isAuthenticated: true, username }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'authStorage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)