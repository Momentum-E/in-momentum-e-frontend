"use client"
import React, { useState } from "react";

interface AddVehicleModalProps {
  onClose: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ onClose }) => {
  const [deviceId, setDeviceId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [company, setCompany] = useState("");

  // You can replace this with your actual list of vehicle manufacturing companies
  const manufacturingCompanies = ["Company A", "Company B", "Company C"];

  const handleAddVehicle = () => {
    // Add your logic to handle the addition of the new vehicle with the entered details
    // For now, you can log the values to the console
    console.log("Device ID:", deviceId);
    console.log("Vehicle Number:", vehicleNumber);
    console.log("Company:", company);

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-md">
      <div className="bg-white p-4 rounded-lg w-96">
        <button onClick={onClose} className="float-right text-xl cursor-pointer">
          &#10006;
        </button>
        <h1 className="text-2xl text-blue-600 font-bold mb-4">Add Vehicle</h1>
        
        {/* Device ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Device ID</label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Vehicle Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Company */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          >
            <option value="" disabled>Select a company</option>
            {manufacturingCompanies.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAddVehicle} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md">
          Add Vehicle
        </button>
      </div>
    </div>
  );
};

export default AddVehicleModal;

