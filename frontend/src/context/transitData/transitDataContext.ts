import { createContext, useContext } from "react";

import type { TransitDataContextType } from "./transitDataTypes";

export const TransitDataContext = createContext<
  TransitDataContextType | undefined
>(undefined);

export const useTransitDataContext = () => {
  const context = useContext(TransitDataContext);
  if (!context) {
    throw new Error(
      "useTransitDataContext must to be used within <TransitDataProvider>",
    );
  }
  return context;
};
