"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

import deleteIcon from "@/public/delete.png";

import AddVehicleModal from "@/components/AddVehicleModal";
import Image from "next/image";
import logo from "@/public/logo.png";

import { Chart } from "@/components/dashboard/Chart";
import { ChargeChart } from "@/components/dashboard/ChargeChart";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { BatteryHealthChart } from "@/components/dashboard/BatteryHealthChart";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

type AuthStore = {
  isAuthenticated: boolean;
  username: string;
  userId: string;
  refreshToken(username: string): Promise<void>;
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
  const { isAuthenticated, username, userId, refreshToken } =
    useAuthStore() as AuthStore;
  console.log(isAuthenticated, username);

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

  // useEffect(() => {
  //   // Check for the presence of refresh token in cookies
  //   const refreshTokenCookie = document.cookie.includes("refreshToken");

  //   if (!refreshTokenCookie) {
  //     // If no refresh token found in cookies, logout the user and redirect to sign-in page
  //     logoutUser();
  //   }
  // }, []);

  // Other functions...

  // const logoutUser = () => {
  //   // Clear local storage
  //   localStorage.clear();
  //   // Redirect to sign-in page
  //   router.push("/signin");
  // };

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
          return refreshToken(userId).then(() => {
            // Retry the original request with the refreshed token
            return fetchUserVehicles();
          });
        }
        if(response.status === 401){
          localStorage.clear();
          router.push("/signin");
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
    <div className="flex w-full h-full">
      {/* Left Section */}
      <div className="bg-gray-800 w-1/6 h-auto text-white p-4">
        <div className="flex items-center justify-center mb-2">
          <Image
            src={logo}
            alt="Momentum-E Logo"
            className="h-11 w-auto shadow-md"
            priority
          />
        </div>
        <hr className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-black to-transparent"></hr>
        {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-black to-transparent"></div> */}

        <button
          onClick={() => setAddVehicleModalOpen(true)}
          className="bg-blue-500 p-2 rounded-md hover:bg-blue-400 text-white h-10 w-full mb-2"
        >
          + Add Vehicle
        </button>
        <div className="text-gray-500">Your vehicles</div>
        <div className="overflow-y-auto">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.VEHICLE_ID}
              className={`flex justify-between p-2 rounded-md cursor-pointer ${
                selectedVehicleId === vehicle.VEHICLE_ID
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "hover:bg-gray-600"
              }`}
            >
              <div
                onClick={() => handleClickOnVehicle(vehicle)}
                className="w-full text-sm"
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
      <div className="w-full">
        <DashboardNav />
        <div className="p-4 bg-gray-200">
          {!selectedVehicle && (
            <h3 className="pt-96 w-full h-screen flex justify-center">
              Please select a vehicle.
            </h3>
          )}
          {selectedVehicle && (
            <>
              <div className="w-full h-20 flex justify-center items-center">
                <div className="flex justify-evenly w-full h-[90%]">
                  <div className="flex justify-start items-center bg-gray-100 rounded-xl shadow-xl hover:shadow- w-full mr-6">
                    <div className="p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#1f2937"
                        className="w-10 h-10 transition-transform transform hover:scale-110"
                      >
                        <path
                          fillRule="evenodd"
                          d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-sm w-full">
                      <h3 className="font-light text-sm">Location</h3>{" "}
                      {selectedVehicle.VEHICLE_NUMBER}
                    </div>
                  </div>
                  <div className="flex justify-start items-center bg-gray-100 rounded-lg shadow-xl w-full mr-6">
                    <div className="p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10 transition-transform transform hover:scale-110"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-sm w-full">
                      <h3 className="font-light text-sm">Connected On</h3>{" "}
                      {selectedVehicle.VEHICLE_NUMBER}
                    </div>
                  </div>
                  <div className="flex justify-start items-center bg-gray-100 rounded-lg shadow-xl w-full">
                    <div className="p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10 transition-transform transform hover:scale-110"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.22 3.22a.75.75 0 0 1 1.06 0l3.97 3.97V4.5a.75.75 0 0 1 1.5 0V9a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h2.69L3.22 4.28a.75.75 0 0 1 0-1.06Zm17.56 0a.75.75 0 0 1 0 1.06l-3.97 3.97h2.69a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0ZM3.75 15a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97H4.5a.75.75 0 0 1-.75-.75Zm10.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-2.69l3.97 3.97a.75.75 0 1 1-1.06 1.06l-3.97-3.97v2.69a.75.75 0 0 1-1.5 0V15Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-sm w-full">
                      <h3 className="font-light text-sm">
                        Data Points Collected
                      </h3>{" "}
                      {selectedVehicle.VEHICLE_NUMBER}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex">
                  <div className="flex flex-col border-black bg-gray-100 text-gray-800 rounded-lg shadow-xl w-full  mr-6 mb-6 mt-5 p-6">
                    <div className="text-lg font-light text-gray-800">
                      Vehicle Info
                    </div>
                    <div className="text-gray-800">
                      <span className="font-light">Odometer :</span> 279372 Km
                    </div>
                    <div>
                      <span className="font-light">Vehicle Model :</span> SEAT
                      Mii
                    </div>
                    <div>
                      <span className="font-light">Model Year :</span> 2021
                    </div>
                    <div>
                      <span className="font-light">VIN :</span>{" "}
                      J1S6JMHAMMX660426
                    </div>
                    <div>
                      <span className="font-light">Battery Capacity :</span> 75
                      kWh
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center border-black bg-gray-100 rounded-lg shadow-xl w-full  mb-6 mt-5 p-6">
                    <div className="flex justify-between w-full text-lg font-light text-gray-800">
                      <div className=" ">Charging Pattern</div>
                      <div className="text-sm border border-gray-800  text-gray-800 rounded-md p-2">
                        <span className="block">Total Energy Consumed</span>
                        <span className="w-full flex items-center justify-center text-blue-500 font-bold">
                          100KW
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-evenly text-sm">
                      <div className="flex flex-col justify-evenly h-full">
                        <div className="">
                          <div>Average SOC</div>
                          <div>100%</div>
                        </div>
                        <div>
                          <div>Connector Type</div>
                          <div>ChaDeMo</div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center transition-transform hover:scale-110">
                        <ChargeChart
                          chargePercentage={selectedVehicle.SOC_START}
                        />
                      </div>
                      <div className="flex flex-col justify-evenly h-full">
                        <div>
                          <div>Total Charging Sessions</div>
                          <div>0</div>
                        </div>
                        <div>
                          <div>Average Charging Rate</div>
                          <div>ChaDeMo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col border-black bg-gray-100 rounded-lg shadow-xl w-full  mr-6  mb-6 p-6">
                    <div className="text-lg font-light text-gray-800">
                      Usage
                    </div>
                    <div className="flex justify-center items-center transition-transform tran hover:scale-[102%]">
                      <UsageChart />
                    </div>
                    <div className="flex text-sm">
                      <div className="flex flex-col justify-around items-start w-full">
                        <div className="mb-4">
                          <div>Avg Daily Km Driven</div>
                          <div>18624.8 km</div>
                        </div>
                        <div>
                          <div>Temperature High/Low</div>
                          <div>12°C / 4.3°C</div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-around items-start w-full">
                        <div className="mb-4">
                          <div>SOC Range</div>
                          <div>20% - 80%</div>
                        </div>
                        <div>
                          <div>Range Observed Max/Min ( Km )</div>
                          <div>120.98 / 120.98</div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-around items-start w-full">
                        <div className="mb-4">
                          <div>Real Pange Observed</div>
                          <div>121 km</div>
                        </div>
                        <div>
                          <div>Observed v/s EPA/WLTP provided</div>
                          <div>121 Km 350 Km</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center border-black bg-gray-100 rounded-lg shadow-xl w-full  mb-6 p-6">
                    <div className="flex justify-between w-full">
                      <div className="text-lg font-light text-gray-800">
                        Battery Health
                      </div>
                      <div className="text-sm border border-gray-800  text-gray-800 rounded-md p-2">
                        <span className="block">State Of Health</span>
                        <span className="w-full flex items-center justify-center text-blue-500 font-bold">
                          100%
                        </span>
                      </div>
                    </div>
                    <div className="transition-transform tran hover:scale-[102%]">
                      <BatteryHealthChart />
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      <div className="flex flex-col justify-center items-start">
                        <div>SoH</div>
                        <div>100.00 %</div>
                      </div>
                      <div>
                        <div>Estimated Degradation</div>
                        <div>0.00 %</div>
                      </div>
                      <div>
                        <div>Battery Chemistry</div>
                        <div>NMC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
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
    </div>
  );
};

export default Dashboard;
