import { createContext } from "react";

interface TripContextType {
  tripData: any;
  setTripData: React.Dispatch<any>;
}

export const CreateTripContext = createContext<TripContextType | null>(null);
