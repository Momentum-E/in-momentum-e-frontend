"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import EmailConfirmationModal from "./EmailConfirmationModal";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await fetch("http://localhost:8080/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      if (response.ok) {
        // Registration successful, show confirmation modal
        // console.log("Registration successful, show confirmation modal");
        setShowConfirmation(true);
        // console.log(showConfirmation);
      } else {
        // Registration failed
        const resData = await response.json();
        toast.error(resData.error);
        console.error("Registration failed");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error during registration:", error.message);
    }
  };

  const handleConfirmEmail = async (confirmationCode: string) => {
    // console.log("inside handleConfirmEmail");
    const { email, name } = formData;

    // console.log(email, confirmationCode, name);
    try {
      const response = await fetch(
        "http://localhost:8080/auth/confirm-sign-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            confirmationCode,
            username: email,
            name: name,
          }),
        }
      );

      if (response.ok) {
        // Email confirmation successful, you can redirect or show a success message
        // console.log("Email confirmation successful");
        setShowConfirmation(false);
        // Show success toast
        toast.success("Signup Successfull! Redirecting to Sign-in page...");

        // Delay redirection to allow toast to display
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } else {
        // Email confirmation failed
        const resData = await response.json();
        toast.error(resData.error);
        console.error("Email confirmation failed");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error during email confirmation:", );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <ToastContainer />
      <h2 className="text-3xl font-semibold mb-6 text-blue-800 text-center">
        Register
      </h2>

      <form className="space-y-4" onSubmit={handleSignUp}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-blue-600"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blue-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="username"
            className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-6">
          <h1 className="text-sm font-medium mb-2 text-blue-600">
            Password requirements
          </h1>
          <p className="text-sm mb-4 text-blue-950">
            <span className="block">- Contains at least 1 number</span>
            <span className="block">
              - Contains at least 1 special character
            </span>
            <span className="block">
              - Contains at least 1 uppercase letter
            </span>
            <span className="block">
              - Contains at least 1 lowercase letter
            </span>
            <span className="block">- Minimum length 8 characters</span>
          </p>

          <label
            htmlFor="password"
            className="block text-sm font-medium text-blue-600 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            className="p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400 w-full"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-blue-600 text-center">
        <Link href="/signin">Already have an account? Sign In</Link>
      </div>

      <EmailConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmEmail}
        email={formData.email}
      />
    </div>
  );
}
