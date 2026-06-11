import { isAxiosError } from "axios";

import type { AppError } from "../types";

export const handleAsyncError = (error: unknown): AppError => {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 404:
        return { msg: "Server not available" };

      case 500:
        return { msg: "Server error" };

      default:
        return { msg: "Data fetching error" };
    }
  }

  return { msg: "Unexpected error" };
};
