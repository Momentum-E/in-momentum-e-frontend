"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        router.push(`forgot-password/confirm-reset-password?email=${username}`); // Redirect to a page indicating that an email was sent for password reset
      } else {
        const data = await response.json();
        console.error(data.error || 'Failed to initiate forgot password request');
      }
    } catch (error) {
      console.error('An unexpected error occurred', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-3xl font-semibold mb-6 text-blue-800 text-center">
        Forgot Password
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-blue-600"
          >
            Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400 w-full"
        >
          Reset Password
        </button>
      </form>

      {/* <div className="mt-4 text-blue-600 text-center">
        <Link href="/signin">
          Sign In
        </Link>
        <span className="mx-2">|</span>
        <Link href="/register">
          Register
        </Link>
      </div> */}
    </div>
  );
};

export default ForgotPassword;
