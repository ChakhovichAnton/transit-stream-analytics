import { handleAsyncError } from "./error";
import type { AsyncData } from "./../types";

export const AsyncDataHelpers = {
  loading: <T>(): AsyncData<T> => ({
    status: "loading",
  }),

  success: <T>(data: T): AsyncData<T> => ({
    status: "success",
    data,
  }),

  error: <T>(error: unknown): AsyncData<T> => ({
    status: "error",
    error: handleAsyncError(error),
  }),
};
