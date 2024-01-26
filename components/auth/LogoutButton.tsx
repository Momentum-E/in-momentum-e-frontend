"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

type AuthStore = {
  logout(): void
}

export default function LogoutButton() {
  const { logout } = useAuthStore() as AuthStore;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call your logout API here
      const response = await fetch(
        "http://localhost:8080/auth/global-sign-out",
        {
          method: "POST",
          credentials: "include", // Include cookies
        }
      );

      if (response.ok) {
        // If the logout API call is successful, update the Zustand store
        logout();
        //remove auth data from local strorage
        localStorage.removeItem("authStorage");
        // Redirect to the home page
        router.push("/");
      } else {
        // Handle logout failure
        console.error("Logout failed");
      }
    } catch (error: { error: any }) {
      console.error("Error during logout:", error.message);
    }
  };

  return <button className="text-white hover:text-blue-800" onClick={handleLogout}>Logout</button>;
}
