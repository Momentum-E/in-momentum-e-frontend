import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
// import Logo from "@/public/logo.png";
import LogoutButton from "../auth/LogoutButton";

import { useAuthStore } from "@/stores/authStore";

interface AuthStore {
  username: string;
}

export function DashboardNav() {
  const { username } = useAuthStore() as AuthStore;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gray-200 px-4 pt-4 w-full">
      <div className="container mx-auto flex justify-end items-center">
        <div className="pr-2 flex justify-center items-center">{username}</div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-gray-800 hover:text-blue-800 focus:outline-none flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-800 hover:bg-blue-200"
              >
                Home
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-blue-200"
              >
                Profile
              </Link>
              <div className="block px-4 py-2 text-gray-800 hover:bg-blue-200">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}