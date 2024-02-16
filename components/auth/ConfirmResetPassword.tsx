"use client"
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmPasswordReset = () => {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const email = searchParmas.get("email");
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/auth/confirm-forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmationCode,
          newPassword,
          username: email,
        }),
      });
      const resData = await response.json();

      if (response.ok) {
        // Password reset confirmed successfully
        toast.success(resData.message);
        setTimeout(() => {
          router.push('/signin');
        }, 2300);
         // Redirect to login page or any other page
      } else {
        toast.error(resData.error);
        console.error(resData.error || 'Failed to confirm password reset');
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error('An unexpected error occurred', error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <ToastContainer />
      <h2 className="text-3xl font-semibold mb-6 text-blue-800 text-center">
        Reset Password
      </h2>

      <p className="mb-4 text-blue-600 text-center">
        A code has been sent to your email: <strong>{email}</strong>
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="confirmationCode"
            className="block text-sm font-medium text-blue-600"
          >
            Confirmation Code
          </label>
          <input
            type="text"
            id="confirmationCode"
            name="confirmationCode"
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => setConfirmationCode(e.target.value)}
            autoComplete='code'
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-blue-600"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            autoComplete="new-password"
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400 w-full"
        >
          Confirm Reset
        </button>
      </form>
    </div>
  );
};

export default ConfirmPasswordReset;
