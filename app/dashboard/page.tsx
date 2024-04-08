"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import deleteIcon from "@/public/delete.png";

import AddVehicleModal from "@/components/AddVehicleModal";
import Image from "next/image";
import logo from "@/public/logo.png";

import { ChargeChart } from "@/components/dashboard/ChargeChart";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { BatteryHealthChart } from "@/components/dashboard/BatteryHealthChart";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { getCookie, getCookies, removeCookie } from "typescript-cookie";
import UploadData from "@/components/dashboard/UploadData";

type AuthStore = {
  isAuthenticated: boolean;
  username: string;
  userId: string;
  userImageUrl: string;
  refreshToken(username: string): Promise<void>;
  setUserImageUrl(url: string): void;
  setIsAuthenticated(isAuthenticated: boolean): void;
  setName(name: string): void;
  setUsername(username: string): void;
  setUserId(userId: string): void;
};

type Vehicle = {
  VEHICLE_ID: string;
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
  LOCATION: string;
  CHARGING_STATUS: string;
  Vehicle_Info: {
    Odometer: string;
    Vehicle_Model: string;
    Model_Year: string;
    VIN: string;
    Battery_Capacity: string;
    Charging_Pattern: {
      Total_Energy_Consumed: string;
      Average_SOC: string;
      Connector_Type: string;
      Total_Charging_Sessions: number;
      Average_Charging_Rate: string;
    };
    Usage: {
      Avg_Daily_km_Driven: string;
      Temperature_High_Low: string;
      SOC_Range: string;
      Range_Observed_Max_Min: string;
      Real_Range_Observed: string;
      Observed_vs_EPA_WLTP_provided: string;
    };
    Battery_Health: {
      State_Of_Health: string;
      SoH: string;
      Estimated_Degradation: string;
      Battery_Chemistry: string;
      Monthly_SOH_Data: [];
    };
    RUL: string;
    EOL: string;
    Connected_On: string;
    Data_Points_Collected: string;
    Average_Miles_Driven: [];
    Battery: {
      odometer: String;
      batteryCapacity: String;
      vehicleModel: String;
      modelYear: String;
      formFactor: String;
      averageSOC: Number;
      totalChargingSessions: String;
      averageChargingRate: String;
      chargingRate: String;
      SoH: String | null;
      estimatedDegradation: String | null;
      batteryChemistry: String;
      SOCRange: String;
      temperature_High_Low: String;
      estimatedPowerOutput: String;
      estimatedCapacityOutput: String;
      speed_Max_Average: String;
      avgDailyKmDriven: Number;
      estimatedDailyEnergyOutput: String
    };
  };
};

const Dashboard = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    username,
    userId,
    userImageUrl,
    refreshToken,
    setUserImageUrl,
    setIsAuthenticated,
    setName,
    setUsername,
    setUserId,
  } = useAuthStore() as AuthStore;
  // console.log(isAuthenticated, username);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );

  const fetchUserVehicles: () => Promise<void> = async () => {
    try {
      // console.log("fetchUserVehicles called");

      const response = await fetch("https://in-momentum-e-backend.onrender.com/user/get-vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username }),
        credentials: "include",
      });

      if (response.status === 403) {
        await handleTokenRefresh();
        return fetchUserVehicles(); // Retry the original request with the refreshed token
      }

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
        } else {
          throw new Error("Failed to fetch user vehicles");
        }
      }

      const data = await response.json();
      setVehicles(data.vehicles);
    } catch (error: any) {
      console.error("Error fetching user vehicles:", error.message);
      // Handle error appropriately
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await fetch(
        `https://in-momentum-e-backend.onrender.com/user-data/profile-picture`,
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
        const imageUrl = URL.createObjectURL(blob); // Create a local URL for the fetched image
        setImageUrl(imageUrl);
        setUserImageUrl(imageUrl);
      } else if (response.status === 403) {
        await refreshToken(userId);
        await fetchProfileImage();
      } else if (response.status === 401) {
        handleUnauthorized();
      } else {
        setUserImageUrl("");
        // throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("There was a problem fetching profile picture:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    // If the user is not authenticated, redirect to the home page
    if (!isAuthenticated) {
      // console.log("isAuthenticated", isAuthenticated);
      router.push("/signin");
    } else {
      // Fetch user's vehicles when authenticated
      router.push("/dashboard");
      fetchUserVehicles();
      fetchProfileImage();
      // console.log(getCookies());
    }
  }, [isAuthenticated, router]);

  const handleTokenRefresh = async () => {
    await refreshToken(userId);
  };

  const handleUnauthorized = () => {
    try {
      // console.log("handleUnauthorized()");
      // console.log(localStorage.getItem("authStorage"));
      setIsAuthenticated(false);
      setUsername("");
      setUserId("");
      setName("");

      removeCookie("refreshToken");
      removeCookie("idToken");
      removeCookie("accessToken");
      router.push("/signin");
      // console.log("handleUnauthorized() closed");
    } catch (error) {
      console.error("Error handling unauthorized:", error);
      // Handle error appropriately, such as fallback redirection
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    // if (!selectedVehicle) return; // No vehicle selected, do nothing
    // console.log("delete called");

    const {
      VEHICLE_ID,
      IOT_DEVICE_DETAILS: { SERIAL_NUMBER },
    } = vehicle;

    // Send a request to delete the vehicle
    await fetch("https://in-momentum-e-backend.onrender.com/user/deleteVehicle", {
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
      .then(async (response) => {
        if (!response.ok) {
          toast.error(response.statusText);
          throw new Error("Failed to delete vehicle");
        } else if (response.status == 403) {
          await refreshToken(userId);
          return handleDelete(vehicle);
        }
        // toast.success("Vehicle Deleted");
        return response.json();
      })
      .then((data) => {
        // console.log("Vehicle deleted successfully:", data.message);
        toast.success(data.message);
        setSelectedVehicle(null);
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
    toast.success("Vehicle Added Successfully");
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
      <ToastContainer containerId="dashboardToast" />
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

        <UploadData />
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
                  onClick={() => handleDelete(vehicle)}
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right section */}
      <div className="w-full">
        <DashboardNav selecedVehicleId={selectedVehicleId} />
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
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-map-pin w-10 h-10 transition-transform transform hover:scale-110"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="text-sm w-full">
                      <h3 className="font-light text-sm">Location</h3>{" "}
                      {selectedVehicle.LOCATION}
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
                      {
                        selectedVehicle.Vehicle_Info.Connected_On.toString().split(
                          "T"
                        )[0]
                      }
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
                      {selectedVehicle.Vehicle_Info.Data_Points_Collected}
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
                      <span className="font-light">Battery Cycle Number :</span>{" "}
                      {selectedVehicle.Vehicle_Info.Battery.odometer}
                    </div>
                    <div>
                      <span className="font-light">Vehicle Model :</span>{" "}
                      {selectedVehicle.Vehicle_Info.Vehicle_Model}
                    </div>
                    <div>
                      <span className="font-light">Model Year :</span>{" "}
                      {selectedVehicle.Vehicle_Info.Model_Year}
                    </div>
                    <div>
                      <span className="font-light">VIN :</span>{" "}
                      {selectedVehicle.Vehicle_Info.VIN}
                    </div>
                    <div>
                      <span className="font-light">Battery Capacity :</span>{" "}
                      {selectedVehicle.Vehicle_Info.Battery.batteryCapacity}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center border-black bg-gray-100 rounded-lg shadow-xl w-full  mb-6 mt-5 p-6">
                    <div className="flex justify-between w-full text-lg font-light text-gray-800">
                      <div className="">Charging Pattern</div>
                      <div className="text-sm border border-gray-800  text-gray-800 rounded-md p-2">
                        <span className="block">Total Energy Consumed</span>
                        <span className="w-full flex items-center justify-center text-blue-500 font-bold">
                          {
                            selectedVehicle.Vehicle_Info.Charging_Pattern
                              .Total_Energy_Consumed
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-evenly text-sm">
                      <div className="flex flex-col justify-evenly h-full">
                        <div className="">
                          <div className="font-light">Average SOC</div>
                          <div>
                            {selectedVehicle.Vehicle_Info.Battery.averageSOC
                              .toFixed(2)
                              .toString() + "%"}
                          </div>
                        </div>
                        <div>
                          <div className="font-light">Connector Type</div>
                          <div>
                            {
                              selectedVehicle.Vehicle_Info.Charging_Pattern
                                .Connector_Type
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center transition-transform hover:scale-110">
                        <ChargeChart
                          chargePercentage={Number(selectedVehicle.Vehicle_Info.Battery.averageSOC.toFixed(2))}
                        />
                      </div>
                      <div className="flex flex-col justify-evenly h-full">
                        <div>
                          <div className="font-light">
                            Total Charging Sessions
                          </div>
                          <div>
                            {
                              selectedVehicle.Vehicle_Info.Battery
                                .totalChargingSessions
                            }
                          </div>
                        </div>
                        <div>
                          <div className="font-light">
                            Average Charging Rate
                          </div>
                          <div>
                            {parseFloat(
                              selectedVehicle.Vehicle_Info.Battery.chargingRate.toString()
                            ).toFixed(2) + "A"}
                          </div>
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
                      <UsageChart
                        avgMilesData={
                          selectedVehicle.Vehicle_Info.Average_Miles_Driven
                        }
                      />
                    </div>
                    <div className="flex text-sm">
                      <div className="flex flex-col justify-around items-start w-full">
                        <div className="mb-4">
                          <div className="font-light">Avg Daily Km Driven</div>
                          <div>
                            {selectedVehicle.Vehicle_Info.Battery.avgDailyKmDriven.toString() +
                              " km"}
                          </div>
                        </div>
                        <div>
                          <div className="font-light">Temperature High/Low</div>
                          <div>
                            {
                              selectedVehicle.Vehicle_Info.Battery
                                .temperature_High_Low
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-around items-start w-full">
                        <div className="mb-4">
                          <div className="font-light">SOC Range</div>
                          <div>
                            {selectedVehicle.Vehicle_Info.Battery.SOCRange}
                          </div>
                        </div>
                        <div>
                          <div className="font-light">
                            Estimated Daily Energy Output
                          </div>
                          <div>
                            {
                              selectedVehicle.Vehicle_Info.Battery.estimatedPowerOutput
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-around items-start w-full">
                        <div className="mb-4">
                          <div className="font-light">Speed Avg/Max</div>
                          <div>
                            {
                              selectedVehicle.Vehicle_Info.Battery.speed_Max_Average + " km/h"
                            }
                          </div>
                        </div>
                        <div>
                          <div className="font-light">
                            Estimated Daily Capacity Output
                          </div>
                          <div>
                            {
                              selectedVehicle.Vehicle_Info.Battery.estimatedDailyEnergyOutput
                            }
                          </div>
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
                        <span className="block font-light">
                          State Of Health
                        </span>
                        <span className="w-full flex items-center justify-center text-blue-500 font-bold">
                          {
                            selectedVehicle.Vehicle_Info.Battery_Health
                              .State_Of_Health
                          }
                        </span>
                      </div>
                    </div>
                    <div className="transition-transform tran hover:scale-[102%]">
                      <BatteryHealthChart
                        Monthly_SOH_Data={
                          selectedVehicle.Vehicle_Info.Battery_Health
                            .Monthly_SOH_Data
                        }
                      />
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      <div className="flex flex-col justify-center items-start">
                        <div className="font-light">SoH</div>
                        <div>{selectedVehicle.Vehicle_Info.Battery.SoH}</div>
                      </div>
                      <div>
                        <div className="font-light">Estimated Degradation</div>
                        <div>
                          {
                            selectedVehicle.Vehicle_Info.Battery
                              .estimatedDegradation
                          }
                        </div>
                      </div>
                      <div>
                        <div className="font-light">Battery Chemistry</div>
                        <div>
                          {
                            selectedVehicle.Vehicle_Info.Battery
                              .batteryChemistry
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex  border-black bg-gray-100 text-gray-800 rounded-lg shadow-xl w-full  mr-6 mb-6 p-6 text-lg font-light">
                    <div>
                      End Of Life :{" "}
                      {/* <span className="text-sm font-normal">
                        {selectedVehicle.Vehicle_Info.EOL}
                      </span> */}
                    </div>
                    {/* <div className="text-sm font-medium">DD-MM-YYY</div> */}
                  </div>
                  <div className="flex flex-col border-black bg-gray-100 rounded-lg shadow-xl w-full mb-6 p-6 text-lg font-light text-gray-800">
                    <div>
                      Remaining Useful Life :{" "}
                      {/* <span className="text-sm font-normal">
                        {selectedVehicle.Vehicle_Info.RUL}
                      </span> */}
                    </div>
                    {/* <div>1200 cycles</div> */}
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
