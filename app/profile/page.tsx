"use client";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import Image from "next/image";
import { useState } from "react";

import Logo from "@/public/logo.png";
import { ProfileNav } from "@/components/profile/ProfileNav";

const ProfilePage = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  // Function to handle change password submit
  const handleChangePasswordSubmit = () => {
    // Implement your logic here
  };

  // Function to handle delete account submit
  const handleDeleteAccountSubmit = () => {
    // Implement your logic here
  };

  return (
    <div className="flex flex-col w-full bg-white relative">
      <div>
        <ProfileNav />
      </div>
      {/* User Profile */}
      <div className="absolute h-full top-40 left-0 right-0 flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center h-auto items-center p-4 w-2/3 bg-gray-200 border rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-40 h-40"
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-bold text-center mt-4">User Name</h2>
          <p className="text-gray-600 text-center mt-2">user@example.com</p>
          <p className="text-gray-600 text-center mt-2">
            Number of vehicles added: 3
          </p>
          <button
            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsChangePasswordModalOpen(true)}
          >
            Change Password
          </button>
          {/* Delete Account Button */}
          <button
            className="text-sm text-red-600 hover:text-red-900 focus:outline-none"
            onClick={() => setIsDeleteAccountModalOpen(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="relative bg-white rounded-lg overflow-hidden max-w-md">
            <div className="p-8">
              <h2 className="text-lg font-bold mb-4">Change Password</h2>
              {/* Password Change Form */}
              <form onSubmit={handleChangePasswordSubmit}>
                {/* Input Fields */}
                {/* Password Fields */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    New Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                {/* Submit Button */}
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Confirm
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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
