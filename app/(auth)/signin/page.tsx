"use client"
import SignIn from "@/components/auth/SignIn";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthStore {
  isAuthenticated: boolean;
}

export default function Signin() {
  const { isAuthenticated } = useAuthStore() as AuthStore;
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);

  return <SignIn />;
}
