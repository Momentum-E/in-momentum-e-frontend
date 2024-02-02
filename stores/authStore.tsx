import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: "",
      userId: "",
      login: (username: string, userId: string) => set({ isAuthenticated: true, username, userId }),
      logout: () => set({ isAuthenticated: false }),
      // Token refresh function
      refreshToken: async (userId: string) => {
        try {
          const response = await fetch(
            "http://localhost:8080/auth/refresh-auth",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: userId }),
              credentials: "include",
            }
          );
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
      name: "authStorage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
