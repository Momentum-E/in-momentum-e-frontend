"use client";

import { FormEvent, useState, useEffect } from "react";
import { ProfileNav } from "@/components/profile/ProfileNav";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCookie, setCookie } from "typescript-cookie";
import DefaultUserImage from "@/public/abcd.jpg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthStore {
  isAuthenticated: boolean;
  username: string;
  name: string;
  userImageUrl: string;
  logout(): string;
  refreshToken(): void;
  setUserImageUrl(url: string): void;
}

const ProfilePage = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    name,
    userImageUrl,
    logout,
    refreshToken,
    setUserImageUrl,
  } = useAuthStore() as AuthStore;
  const username = useAuthStore((state: any) => state.username);
  console.log(username);

  const [file, setFile] = useState<string | Blob>("");
  // const [imageUrl, setImageUrl] = useState<string>("");
  const [previousPassword, setPreviousPassword] = useState("");
  const [proposedPassword, setProposedPassword] = useState("");
  // const [changePasswordError, setChangePasswordError] = useState(null);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    } else {
      router.push("/profile");
    }
  }, [isAuthenticated, router, userImageUrl]);

  const fetchProfileImage = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/user-data/profile-picture`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: username }),
        }
      );

      if (response.ok) {
        const blob = await response.blob(); // Get the image data as a blob
        console.log(blob);
        const imageUrl = URL.createObjectURL(blob); // Create a local URL for the fetched image
        console.log(imageUrl);
        setUserImageUrl(imageUrl);
      } else {
        toast.error("error fetching user Image");
        throw new Error("Network response was not ok.");
      }
    } catch (error: any) {
      console.error("There was a problem fetching profile picture:", error);
      toast.error(error.message);
    }
  };

  const deleteProfileImage = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/user-data/remove-profile-picture",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: username }), // Include the user's email in the request body
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Profile picture deleted successfully");
        setUserImageUrl("");
        // await fetchProfileImage(); // Refresh the profile picture after deletion
      } else {
        toast.error("Error deleting profile picture");
        throw new Error("Network response was not ok.");
      }
    } catch (error: any) {
      console.error("There was a problem deleting the profile picture:", error);
      toast.error(error.message);
    }
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", username);

    try {
      const response = await fetch(
        "http://localhost:8080/user-data/upload/profile-picture",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded:", data);
        toast.success("Image Upload Successfull!");
        await fetchProfileImage();
        setFile("");
      } else {
        console.error("Error uploading image:", response.statusText);
        toast.error(response.statusText);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message);
    }
  };

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
        // console.log(data);
        // If the request is successful, display a success message
        toast.success(data.message);
      } else if (response.status == 403) {
        refreshToken();
        handleChangePasswordSubmit(e);
      } else {
        // If an error occurs, throw an error with the response status and message
        const errorData = await response.json();
        toast.error(errorData.message);
        throw new Error(`${response.status}: ${errorData.error}`);
      }
    } catch (error: any) {
      // If an error occurs, set the error state with the error message
      toast.error(error.message);
      // setChangePasswordError(error.message);
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
        toast.error(errorData.message || errorData.error);
        throw new Error(`${response.status}: ${errorData.error}`);
      }
    } catch (error: any) {
      // If an error occurs, display the error message
      toast.error(error.message);
    }
  };

  return (
    <>
      {isAuthenticated && (
        <div className="relative w-full h-full">
          <ToastContainer />
          <ProfileNav />

          <div className="absolute top-40 left-60 right-60 p-8 bg-gray-200 rounded-lg shadow-2xl shadow-gray-500">
            {/* name and image */}
            <div className="flex flex-col justify-center items-center">
              {userImageUrl ? (
                <Image
                  className="cursor-pointer rounded-full"
                  src={userImageUrl}
                  alt="user Image"
                  width={200}
                  height={200}
                  priority
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-40 h-40 cursor-pointer0"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              <form onSubmit={handleSubmit} className="flex my-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm focus:outline-none"
                ></input>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-blue-500 rounded-md p-2 mt-1 ml-2 w-40"
                >
                  Upload
                </button>
                <button
                  onClick={deleteProfileImage}
                  className="bg-red-500 rounded-md p-2 mt-1 ml-2 w-40"
                >
                  Delete
                </button>
              </form>
              <h2 className="text-2xl font-bold">{name || username}</h2>
              <p className="text-gray-600">{username}</p>
            </div>
            {/* change password */}
            <div className="mt-12 space-y-4 w-full px-72">
              <form
                onSubmit={handleChangePasswordSubmit}
                className="space-y-4 border-2 p-8 px-16 shadow-xl shadow-gray-400 rounded-md"
              >
                <h1 className="text-lg font-semibold">Change Password</h1>
                <div>
                  <input
                    type="text"
                    className="sr-only"
                    name="username"
                    value={username}
                    readOnly
                    aria-hidden="true"
                    autoComplete="username"
                  />
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={previousPassword}
                    onChange={(e) => setPreviousPassword(e.target.value)}
                    className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={proposedPassword}
                    onChange={(e) => setProposedPassword(e.target.value)}
                    className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
                >
                  Change Password
                </button>
                {/* {changePasswordError && (
                  <p className="text-red-500">{changePasswordError}</p>
                )} */}
              </form>
            </div>
            {/* delete account */}
            <div className="mt-12 space-y-4 w-full px-72">
              <div className="space-y-4 border-2 p-8 px-16 shadow-xl shadow-gray-400 rounded-md">
                <h1 className="text-lg font-semibold">Delete Account</h1>
                <button
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-400"
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {isDeleteAccountModalOpen && (
            <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="relative bg-white rounded-lg overflow-hidden max-w-md">
                <div className="p-8">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-bold">Delete Account</h2>
                    <button
                      onClick={() => setIsDeleteAccountModalOpen(false)}
                      className="text-xl cursor-pointer"
                    >
                      &#10006;
                    </button>
                  </div>

                  <p className="text-sm text-gray-700 mb-6">
                    Are you sure you want to delete your account?
                  </p>
                  <form onSubmit={handleDeleteAccountSubmit}>
                    <button
                      type="submit"
                      className="w-full bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-400"
                    >
                      Yes, Delete My Account
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
