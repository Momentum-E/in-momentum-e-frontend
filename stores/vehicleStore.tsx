import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Vehicle {
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
}

export const useVehicleStore = create(
  persist(
    (set) => ({
      vehicles: [],
      addVehicle: (vehicle: Vehicle) =>
        set((state: any) => ({ vehicles: [...state.vehicles, vehicle] })),
      removeVehicle: (vehicle: Vehicle) =>
        set((state: any) => ({ vehicles: [...state.vehicles, vehicle] })),   
    }),
    {
      name: "vehicleStorage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
