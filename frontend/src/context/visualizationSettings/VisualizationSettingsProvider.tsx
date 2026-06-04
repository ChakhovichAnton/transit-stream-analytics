import { useState, type PropsWithChildren, type FC } from "react";
import { VisualizationSettingsContext } from "./visualizationSettingsContext";
import type { ColorMode } from "../../types";

export const VisualizationSettingsProvider: FC<PropsWithChildren> = (props) => {
  const [colorMode, setColorMode] = useState<ColorMode>("SPEED_LIMIT");

  return (
    <VisualizationSettingsContext.Provider value={{ colorMode, setColorMode }}>
      {props.children}
    </VisualizationSettingsContext.Provider>
  );
};
