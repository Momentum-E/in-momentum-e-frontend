"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";

import { useAuthStore } from "@/stores/authStore";

import LogoutButton from "@/components/auth/LogoutButton";

// Assuming your useAuthStore hook returns a type like this
type AuthStore = {
  isAuthenticated: boolean;
};

export default function Navbar() {
  const { isAuthenticated } = useAuthStore() as AuthStore;

  return (
    <nav className="bg-blue-500 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo on the left */}
        <Link
          href="/"
          className="text-white text-lg font-bold transition-transform transform hover:scale-110"
        >
          <Image src={Logo} alt="Momentum-E Logo" className="h-10 w-auto" priority/>
        </Link>

        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                className="text-white hover:text-blue-800"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="text-blue-600 hover:text-blue-900 hover:bg-gray-200 hover:font-medium bg-gray-100 p-2 rounded-lg" href="/signin">
                Sign In
              </Link>
              {/* <Link href="/register" className="text-white hover:text-blue-800">
                Register
              </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
