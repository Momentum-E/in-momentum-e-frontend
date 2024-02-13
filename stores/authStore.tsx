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
            "http://localhost:8080/auth/global-sign-out",
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
                "http://localhost:8080/auth/refresh-auth",
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
    }),
    {
      name: "authStorage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
