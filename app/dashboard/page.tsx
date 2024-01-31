"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

import deleteIcon from "@/public/delete.png";

import AddVehicleModal from "@/components/AddVehicleModal";
import Image from "next/image";

type AuthStore = {
  isAuthenticated: boolean;
  username: string;
  refreshToken(username:string): Promise<void>;
};

type Vehicle = {
  VEHICLE_ID: string;
  TRIP_ID: string;
  TRIP_START_TIME: string;
  ODOMETER_START_READING: number;
  SOC_START: number;
  SOC_END: number;
  AVG_VELOCITY: number;
  AC_ON_DURATION: number;
  CHARGE_TYPE: string;
  DISTANCE: number;
  AMBIENT_TEMPERATURE: number;
  BATTERY_TEMPERATURE: number;
  VEHICLE_NUMBER: string;
  IOT_DEVICE_DETAILS: {
    SERIAL_NUMBER: string;
    ID: string;
  };
  LOCATION: {
    LATITUDE: number;
    LONGITUDE: number;
  };
  CHARGING_STATUS: string;
};

const Dashboard = () => {
  const router = useRouter();
  const { isAuthenticated, username, refreshToken } = useAuthStore() as AuthStore;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // If the user is not authenticated, redirect to the home page
    if (!isAuthenticated) {
      router.push("/");
    } else {
      // Fetch user's vehicles when authenticated
      fetchUserVehicles();
    }
  }, [isAuthenticated, router]);

  const fetchUserVehicles = async () => {
    // Assuming your API endpoint to fetch user's vehicles is '/api/user/vehicles'
    await fetch("http://localhost:8080/user/get-vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Assuming you need to send the email in the request body
      body: JSON.stringify({ email: username }), // Replace userEmail with the actual email
      credentials: "include",
    })
      .then(async (response) => {
        if (response.status === 403) {
          // Trigger token refresh flow
          return refreshToken(username).then(() => {
            // Retry the original request with the refreshed token
            return fetchUserVehicles();
          });
        }
        if (!response.ok) {
          throw new Error("Failed to fetch user vehicles");
        }
        return response.json();
      })
      .then((data) => {
        console.log("setVehicles", data.vehicles);
        // Set the fetched vehicles in state
        setVehicles(data.vehicles);
      })
      .catch((error) => {
        console.error("Error fetching user vehicles:", error.message);
        // Handle error appropriately
      });
  };

  const handleDelete = () => {
    if (!selectedVehicle) return; // No vehicle selected, do nothing
    console.log("delete called");

    const {
      VEHICLE_ID,
      IOT_DEVICE_DETAILS: { SERIAL_NUMBER },
    } = selectedVehicle;

    // Send a request to delete the vehicle
    fetch("http://localhost:8080/user/deleteVehicle", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        vehicleId: VEHICLE_ID,
        serialNumber: SERIAL_NUMBER,
      }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete vehicle");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Vehicle deleted successfully:", data.message);
        // Optionally, we can update the vehicles state to reflect the changes
        // For example, refetch user's vehicles
        fetchUserVehicles();
      })
      .catch((error) => {
        console.error("Error deleting vehicle:", error.message);
        // Handle error appropriately
      });
  };

  const handleAddVehicle = () => {
    // Function to update the list of vehicles after adding a vehicle
    fetchUserVehicles();
  };

  const handleClickOnVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedVehicleId(vehicle.VEHICLE_ID);
  };

  if (!isAuthenticated) {
    // If not authenticated, you can also display a loading spinner or message
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Left Section */}
      <div className="bg-gray-800 text-white w-1/5 p-4 h-screen">
        <button
          onClick={() => setAddVehicleModalOpen(true)}
          className="bg-blue-500 p-2 rounded-md hover:bg-blue-400 text-white h-10 w-full mb-4"
        >
          + Add Vehicle
        </button>
        <div className="overflow-y-auto">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.VEHICLE_ID}
              className={`flex justify-between p-2 cursor-pointer ${
                selectedVehicleId === vehicle.VEHICLE_ID
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "hover:bg-gray-600"
              }`}
            >
              <div
                onClick={() => handleClickOnVehicle(vehicle)}
                className="w-full"
              >
                {vehicle.VEHICLE_NUMBER}
              </div>
              <div className="flex justify-center items-center transition-transform transform hover:scale-125">
                <Image
                  src={deleteIcon}
                  alt="delete icon"
                  height={20}
                  width={20}
                  onClick={handleDelete}
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right section */}
      <div className="w-full h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="flex justify-between mb-4">
          <span className="text-lg font-semibold">Welcome, {username}</span>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Refresh Data
          </button>
        </div>
        {selectedVehicle && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Selected Vehicle</h2>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <span className="font-semibold">Vehicle ID:</span>{" "}
                {selectedVehicle.VEHICLE_ID}
              </p>
              <p>
                <span className="font-semibold">Vehicle Number:</span>{" "}
                {selectedVehicle.VEHICLE_NUMBER}
              </p>
              <p>
                <span className="font-semibold">Charging Status:</span>{" "}
                {selectedVehicle.CHARGING_STATUS}
              </p>
              <p>
                <span className="font-semibold">Location:</span> Latitude -{" "}
                {selectedVehicle.LOCATION.LATITUDE}, Longitude -{" "}
                {selectedVehicle.LOCATION.LONGITUDE}
              </p>
              <p>
                <span className="font-semibold">Start Time:</span>{" "}
                {selectedVehicle.TRIP_START_TIME}
              </p>
              <p>
                <span className="font-semibold">Odometer Start Reading:</span>{" "}
                {selectedVehicle.ODOMETER_START_READING}
              </p>
              {/* Add more telemetrics here */}
            </div>
          </div>
        )}
      </div>
      {/* Add Vehicle Modal */}
      {isAddVehicleModalOpen && (
        <AddVehicleModal
          onClose={() => setAddVehicleModalOpen(false)}
          onAddVehicle={handleAddVehicle}
        />
      )}
    </div>
  );
};

export default Dashboard;
