import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
// import { useRouter } from "next/navigation";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      name: "",
      username: "",
      userId: "",
      userImageUrl: "",
      login: async (username: string, userId: string, name: string) => {
        try {
          set({ isAuthenticated: true, username, userId, name });
        } catch (error) {
          console.error("Error during login:", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          const response = await fetch(
            "https://in-momentum-e-backend.onrender.com/auth/global-sign-out",
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (response.ok) {
            set({ isAuthenticated: false, username: "", userId: "", name: "" });
            localStorage.removeItem("authStorage");
          } else {
            console.error("Logout failed");
            throw new Error("Logout failed");
          }
        } catch (error) {
          console.error("Error during logout:", error);
          throw error;
        }
      },
      refreshToken: async (userId: string) => {
        try {
          const response = await fetch(
            "https://in-momentum-e-backend.onrender.com/auth/refresh-auth",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId }),
              credentials: "include",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }
          return true; // Indicate successful token refresh
        } catch (error) {
          console.error("Error refreshing token:", error);
          throw error;
        }
      },
      setUserImageUrl: async (url: string) => {
        try {
          set({ userImageUrl: url });
        } catch (error) {
          console.error("Error during image url setting:", error);
          throw error;
        }
      },
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setName: (name: string) => set({ name }),
      setUsername: (username: string) => set({ username }),
      setUserId: (userId: string) => set({ userId }),
    }),
    {
      name: "authStorage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
