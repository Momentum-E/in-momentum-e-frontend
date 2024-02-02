"use client";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/authStore";

interface SigninFormData {
  username: string;
  password: string;
}

type AuthStore = {
  login(username: string): void;
};

export default function Signin() {
  const router = useRouter();
  const { login } = useAuthStore() as AuthStore;

  const [formData, setFormData] = useState<SigninFormData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getCurrentUserEmailAndUserId = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/get-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        credentials: "include",
      });
      // console.log("response", response.json);
      if (response.ok) {
        console.log("get user details seccessful");
        console.log("response", response);
        return response;
      } else {
        console.error("get user details failed");
      }
    } catch (error: any) {
      console.error("Error during fetching user:", error.message);
    }
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;

    try {
      const response = await fetch("http://localhost:8080/auth/initiate-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        // Sign in successful
        console.log("Sign in successful");
        const userData = await getCurrentUserEmailAndUserId();
        console.log("userData", userData?.body)
        // const userId = userData.userId;
        login(username);
        router.push("/dashboard");
      } else {
        // Sign in failed
        console.error("Sign in failed");
      }
    } catch (error: any) {
      console.error("Error during sign in:", error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <h2 className="text-3xl font-semibold mb-6 text-blue-800 text-center">
        Sign In
      </h2>

      <form className="space-y-4" onSubmit={handleSignIn}>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-blue-600"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-blue-600"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400 w-full"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-blue-600 text-center">
        <Link href="/register">Register</Link>
        <span className="mx-2">|</span>
        <Link href="/forgot-password">Forgot Password</Link>
      </div>
    </div>
  );
}
