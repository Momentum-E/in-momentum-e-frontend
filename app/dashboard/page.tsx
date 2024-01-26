"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

type AuthStore = {
  isAuthenticated: boolean;
  username: string;
};

const Dashboard = () => {
  const router = useRouter();
  const { isAuthenticated, username } = useAuthStore() as AuthStore;

  useEffect(() => {
    // If the user is not authenticated, redirect to the home page
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // If not authenticated, you can also display a loading spinner or message
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-3xl h-screen">
      <h1>Dashboard Page</h1>
      <span className="font-bold">Welcome {username}</span>
    </div>
  );
};

export default Dashboard;
