export type AppError = {
  msg: string;
};

export type AsyncData<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: AppError };

export type ColorMode = "SPEED_LIMIT" | "ABSOLUTE";

export interface LineStringResponse {
  type: "LineString";
  coordinates: [number, number][];
}

export interface RoadSectionResponse {
  id: number;
  osmid: number[];
  highway?: string[] | null;
  lanes?: number[] | null;
  maxspeed?: number[] | null;
  location_name?: string | null;
  oneway?: boolean | null;
  reversed?: boolean | null;
  length: number;
  geom: LineStringResponse;
}

export interface TransitEventResponse {
  id: number;
  road_section_id: number;
  direction: 1 | 2;
  speed: number;
  timestamp: string; // ISO datetime string
  vehicle_id: number;
  lat: number;
  lon: number;
  timetable_offset: number;
  doors_open: boolean;
  route: string;
  line: string;
}

export interface TransitResponse {
  type: "TransitEventWithSectionCoords";
  event: TransitEventResponse;
  road_section: RoadSectionResponse;
}

export interface AggregatedTransitEventResponse {
  id: number;
  road_section_id: number;
  window_start: string;
  window_end: string;
  avg_speed: number;
  min_speed: number;
  max_speed: number;
  avg_timetable_offset: number;
  min_timetable_offset: number;
  max_timetable_offset: number;
  count: number;
}

export interface AggregatedTransitResponse {
  type: "TransitEventWithSectionCoords";
  event: AggregatedTransitEventResponse;
  road_section: RoadSectionResponse;
}

type TwoDigit = `${number}${number}`;
type Year = `${number}${number}${number}${number}`;
export type DateString = `${Year}-${TwoDigit}-${TwoDigit}`;

export interface TimeWithData {
  times: Date[];
  day: Date;
  date: DateString;
}
