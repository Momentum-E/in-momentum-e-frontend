"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

type AuthStore = {
  logout(): void;
};

export default function LogoutButton() {
  const { logout } = useAuthStore() as AuthStore;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button className="text-inherit hover:text-blue-800" onClick={handleLogout}>
      Logout
    </button>
  );
}
