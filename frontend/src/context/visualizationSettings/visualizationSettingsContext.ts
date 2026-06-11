import { createContext, useContext } from "react";

import type { VisualizationSettingsContextType } from "./visualizationSettingsTypes";

export const VisualizationSettingsContext = createContext<
  VisualizationSettingsContextType | undefined
>(undefined);

export const useVisualizationContext = () => {
  const context = useContext(VisualizationSettingsContext);
  if (!context) {
    throw new Error(
      "useVisualizationContext must to be used within <VisualizationSettingsProvider>",
    );
  }
  return context;
};
