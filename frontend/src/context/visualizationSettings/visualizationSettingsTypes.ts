import type { ColorMode } from "../../types";

export interface VisualizationSettingsContextType {
  setColorMode: (colorMode: ColorMode) => void;
  colorMode: ColorMode;
}
