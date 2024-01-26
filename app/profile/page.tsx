"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

type AuthStore = {
  isAuthenticated: boolean;
};

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore() as AuthStore;

  useEffect(() => {
    // If the user is not authenticated, redirect to the home page
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // If not authenticated, you can also display a loading spinner or message
    return <div>Loading...</div>;
  }

  return <h1>Profile Page</h1>;
}
