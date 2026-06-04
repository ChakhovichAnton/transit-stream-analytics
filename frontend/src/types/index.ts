export type ColorMode = "SPEED_LIMIT" | "ABSOLUTE";
export type PageStatus = "loading" | "notFound" | "error" | "success";

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
