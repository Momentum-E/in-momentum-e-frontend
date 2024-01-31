import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: '',
      login: (username: string) => set({ isAuthenticated: true, username }),
      logout: () => set({ isAuthenticated: false }),
      // Token refresh function
      refreshToken: async (username: string) => {
        try {
          const response = await fetch("http://localhost:8080/auth/refresh-auth", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({username: username})
          });
          if (!response.ok) {
            // logout();
            throw new Error("Failed to refresh token");
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          throw error; // Rethrow the error for handling in components
        }
      },
    }),
    {
      name: 'authStorage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)