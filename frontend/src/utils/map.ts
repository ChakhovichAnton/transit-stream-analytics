import type { ColorMode } from "../types";

export const getRoadColor = (
  speed: number,
  mode: ColorMode,
  speedLimit?: number,
) => {
  // If speed limit is not known, default to gray
  if (mode === "SPEED_LIMIT" && speedLimit === undefined) {
    return "#808080";
  }

  const normalizedSpeed =
    mode === "SPEED_LIMIT" && speedLimit !== undefined
      ? Math.max(0, Math.min(speed / speedLimit, 1))
      : Math.max(0, Math.min(speed / 100, 1)); // ABSOLUTE mode (0–100 km/h)

  if (normalizedSpeed < 0.25) {
    return `rgb(255, ${Math.round(255 * normalizedSpeed * 4)}, 0)`; // red → orange
  }
  if (normalizedSpeed < 0.5) {
    return `rgb(255, 255, 0)`; // orange → yellow
  }
  if (normalizedSpeed < 0.75) {
    return `rgb(${Math.round(255 * (1 - (normalizedSpeed - 0.5) * 4))}, 255, 0)`; // yellow → greenish
  }

  return `rgb(0, 255, 0)`; // green
};
