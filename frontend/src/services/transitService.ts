import api from "../utils/axios";

import type {
  DateString,
  TimeWithData,
  AggregatedTransitResponse,
  DataDateMode,
} from "../types";

export const getAggregatedTransitData = async (
  window: number,
  startTime: number,
  mode: DataDateMode,
) => {
  const res = await api.get(
    `/api/v1/transit/aggregated/window/${window}/start/${startTime}?mode=${mode.toLowerCase()}`,
  );
  return res.data as AggregatedTransitResponse[];
};

export const getWindowLengths = async () => {
  const res = await api.get(`/api/v1/transit/aggregated/window-length`);
  return res.data as number[];
};

export const getDates = async (window: number) => {
  const res = await api.get(
    `/api/v1/transit/aggregated/window/${window}/dates`,
  );
  const data = res.data as {
    type: "AggregatedTransitDate";
    day: string;
    times: string[];
  }[];

  return data.map((dataPoint) => {
    const [year, month, day] = dataPoint.day.split("-").map(Number);

    return {
      day: new Date(year, month - 1, day),
      times: dataPoint.times.map((time) => new Date(time)),
      date: dataPoint.day as DateString,
    };
  }) satisfies TimeWithData[];
};
