import { type PropsWithChildren, useState } from "react";

import { VisualizationSettingsContext } from "./visualizationSettingsContext";
import type { ColorMode } from "../../types";

export const VisualizationSettingsProvider = (props: PropsWithChildren) => {
  const [colorMode, setColorMode] = useState<ColorMode>("SPEED_LIMIT");

  return (
    <VisualizationSettingsContext.Provider value={{ colorMode, setColorMode }}>
      {props.children}
    </VisualizationSettingsContext.Provider>
  );
};
