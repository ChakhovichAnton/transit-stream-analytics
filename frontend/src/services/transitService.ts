import type { TransitResponse } from "../types";
import api from "../utils/axios";

export const getLatestTransitData = async () => {
  const res = await api.get(`/api/v1/transit/latest`);
  return res.data as TransitResponse[];
};
