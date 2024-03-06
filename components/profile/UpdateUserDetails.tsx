import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

interface AuthStore {
  username: string;
  setName(newUSername: string): void;
}

const UpdateUserDetails: React.FC = () => {
  const { username, setName } = useAuthStore() as AuthStore;
  const [newName, setNewName] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/user-data/update-user-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          newName: newName,
        }),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      // console.log("User details updated successfully");
      setName(newName);
    } catch (error: any) {
      console.error("Error updating user details:", error.message);
    }

    // Reset the input fields after submission
    setNewName("");
  };

  return (
    <div className="space-y-4 border-2 p-8 px-16 shadow-xl shadow-gray-400 rounded-md">
      <h1 className="text-lg font-semibold">Update User Details</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="newName"
          type="text"
          value={newName}
          onChange={handleNameChange}
          className="mt-1 mb-4 p-3 w-full border rounded-md focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
        >
          Update Details
        </button>
      </form>
    </div>
  );
};

export default UpdateUserDetails;
