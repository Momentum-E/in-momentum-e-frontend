"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

import AddVehicleModal from "@/components/AddVehicleModal";

type AuthStore = {
  isAuthenticated: boolean;
  username: string;
};

type Vehicle = {
  id: number;
  name: string;
  // ... other properties
};

const Dashboard = () => {
  const router = useRouter();
  const { isAuthenticated, username } = useAuthStore() as AuthStore;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddVehicleModalOpen, setAddVehicleModalOpen] = useState(false);

  useEffect(() => {
    // If the user is not authenticated, redirect to the home page
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    setAddVehicleModalOpen(false);
  };

  if (!isAuthenticated) {
    // If not authenticated, you can also display a loading spinner or message
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Left Section */}
      <div className="bg-blue-100 w-1/6 p-4 h-screen">
        <button
          onClick={() => setAddVehicleModalOpen(true)}
          className=" bg-blue-500 p-2 rounded-md hover:bg-blue-400 text-white h-10 w-full"
        >
          + Add Vehicle
        </button>
        {vehicles.map((vehicle) => (
          <div key={vehicle.id}>{vehicle.name}</div>
        ))}
      </div>
      {/* right section */}
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1>Dashboard Page</h1>
        <span className="font-bold">Welcome {username}</span>
      </div>
      {/* Add Vehicle Modal */}
      {isAddVehicleModalOpen && (
        <AddVehicleModal onClose={() => setAddVehicleModalOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
