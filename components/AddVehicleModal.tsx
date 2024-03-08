"use client";
import React, { useState } from "react";

import { useAuthStore } from "@/stores/authStore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddVehicleModalProps {
  onClose: () => void;
  onAddVehicle: () => void;
}

type AuthStore = {
  username: string;
  userId: string;
  refreshToken(userId: string): void;
};

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  onClose,
  onAddVehicle,
}) => {
  const { username, userId, refreshToken } = useAuthStore() as AuthStore;
  const [deviceId, setDeviceId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  // const [company, setCompany] = useState("");

  // You can replace this with your actual list of vehicle manufacturing companies
  // const manufacturingCompanies = ["Company A", "Company B", "Company C"];

  const handleAddVehicle = async () => {
    const requestBody = {
      email: username, // Assuming userEmail is the email of the user adding the vehicle
      vehicleId: deviceId,
      serialNumber: vehicleNumber,
    };

    // Make the HTTP POST request to your API endpoint
    await fetch("https://in-momentum-e-backend.onrender.com/user/addVehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      credentials: "include",
    })
      .then(async (response) => {
        if (response.status == 403) {
          await refreshToken(userId);
          handleAddVehicle();
        } else if (!response.ok) {
          throw new Error("Failed to add vehicle");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Vehicle added successfully:", data);
        // Close the modal or perform any other necessary actions
        onClose();
        onAddVehicle();
      })
      .catch((error: any) => {
        console.error("Error adding vehicle:", error.message);
        // Handle error appropriately
      });

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-md z-10">
      <div className="bg-white p-4 rounded-lg w-96">
        <button
          onClick={onClose}
          className="float-right text-xl cursor-pointer"
        >
          &#10006;
        </button>
        <h1 className="text-2xl text-blue-600 font-bold mb-4">Add Vehicle</h1>

        {/* Device ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Vehicle ID
          </label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Vehicle Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {/* Vehicle Number */}
            Serial Number
          </label>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Company */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          >
            <option value="" disabled>
              Select a company
            </option>
            {manufacturingCompanies.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div> */}

        <button
          onClick={handleAddVehicle}
          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md"
        >
          Add Vehicle
        </button>
      </div>
    </div>
  );
};

export default AddVehicleModal;
