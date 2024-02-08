"use client";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Logo from "@/public/logo.png";
import { ProfileNav } from "@/components/profile/ProfileNav";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

interface AuthStore {
  username: string;
  logout(): string;
  refreshToken(): void;
}

const ProfilePage = () => {
  const router = useRouter();
  const { username, logout, refreshToken } = useAuthStore() as AuthStore;
  // const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =useState(false);
  const [previousPassword, setPreviousPassword] = useState("");
  const [proposedPassword, setProposedPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  // Function to handle change password submit
  const handleChangePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(previousPassword, proposedPassword, username);
    try {
      // Make a POST request to the backend route
      const response = await fetch(
        "http://localhost:8080/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            previousPassword,
            proposedPassword,
            username,
          }),
          credentials: "include",
        }
      );

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        // If the request is successful, display a success message
        alert(data.message);
      }
      if (response.status == 403) {
        refreshToken();
        handleChangePasswordSubmit(e);
      } else {
        // If an error occurs, throw an error with the response status and message
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.error}`);
      }
    } catch (error: any) {
      // If an error occurs, set the error state with the error message
      setChangePasswordError(error.message);
    }
  };

  // Function to handle delete account submit
  const handleDeleteAccountSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Make a POST request to the backend route
      const response = await fetch("http://localhost:8080/auth/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username, // Replace with the actual username
        }),
        credentials: "include",
      });

      // Check if the request was successful
      if (response.ok) {
        router.push("/signin");
        logout();
      }
      if (response.status == 403) {
        refreshToken();
        handleDeleteAccountSubmit(e);
      } else {
        // If an error occurs, throw an error with the response status and message
        const errorData = await response.json();
        throw new Error(`${response.status}: ${errorData.error}`);
      }
    } catch (error: any) {
      // If an error occurs, display the error message
      alert(error.message);
    }
  };

  return (
    <div className="relative">
      <div className="">
        <ProfileNav />
      </div>
      {/* User Profile */}
      <div className="absolute h-screen top-40 left-0 right-0 flex flex-col justify-center items-center">
        <div className="flex flex-col  h-full items-center p-4 w-2/3 bg-gray-200 shadow-lg rounded-md">
          <div className="flex flex-col justify-center items-center pt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-60 h-60"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-xl font-bold text-center mt-4">User Name</h2>
            <p className="text-gray-600 text-center mt-2">user@example.com</p>
          </div>
          {/* <hr className="bg-black"></hr> */}
          {/* user statistics */}
          <div className="w-1/2 p-4 flex flex-col justify-center items-center mt-8 border-2 border-gray-800 rounded-md">
            <p className="text-gray-600 text-center mt-2">Active vehicles: 3</p>
            <p className="text-gray-600 text-center mt-2">
              In-active vehicles: 3
            </p>
            <p className="text-gray-600 text-center mt-2">Total Vehicles: 3</p>
          </div>

          {/* Change Password Section */}
          <form
            onSubmit={handleChangePasswordSubmit}
            className="w-1/2 p-4 flex flex-col justify-center items-center mt-8 border-2 border-gray-800 rounded-md"
          >
            <input
              type="text"
              className="sr-only" // This class hides the input field from view
              id="username"
              name="username"
              value={username} // Replace this with the actual username value
              readOnly // Make the field read-only to prevent user input
              aria-hidden="true" // Hide the field from accessibility tools
              autoComplete="username"
            />
            {/* Password Fields */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Current Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={previousPassword}
                onChange={(e) => setPreviousPassword(e.target.value)}
                placeholder="Enter current password"
                required
                autoComplete="new-password"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="newPassword"
                type="password"
                value={proposedPassword}
                onChange={(e) => setProposedPassword(e.target.value)}
                placeholder="Enter new password"
                required
                autoComplete="new-password"
              />
            </div>
            {/* Submit Button */}
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              // onClick={handleChangePasswordSubmit}
            >
              Change Password
            </button>
          </form>
          {/* Delete Account Button */}
          <div className="w-1/2 flex flex-col justify-center items-center mt-8">
            <button
              className="h-full w-full p-4 text-sm text-gray-100 focus:outline-none bg-red-500 hover:bg-red-800 rounded-md"
              onClick={() => setIsDeleteAccountModalOpen(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeleteAccountModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="relative bg-white rounded-lg overflow-hidden max-w-md">
            <div className="p-8">
              <h2 className="text-lg font-bold mb-4">Delete Account</h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete your account?
              </p>
              {/* Delete Account Form */}
              <form onSubmit={handleDeleteAccountSubmit}>
                {/* Submit Button */}
                <button
                  className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Yes, Delete My Account
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
