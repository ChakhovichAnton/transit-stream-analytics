import {
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { useRef } from "react";

import { getRoadColor } from "../utils/map";
import { useVisualizationContext } from "../context/visualizationSettings";
import SpeedLimitSign from "./SpeedLimit";
import MapSidebar from "./MapSidebar";
import { useTransitDataContext } from "../context/transitData";
import { formatDate, formatTime } from "../utils/format";

const MAP_DEFAULTS = {
  center: [60.1699, 24.9384] satisfies [number, number],
};

const InteractiveMap = () => {
  const { colorMode } = useVisualizationContext();
  const { transitData } = useTransitDataContext();
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="w-full h-full relative">
      <MapSidebar />
      <MapContainer
        center={MAP_DEFAULTS.center}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        {transitData.status === "success" && transitData.data.length > 0 && (
          <>
            {transitData.data.map((transit) => {
              const metrics = [
                {
                  label: "Average Speed",
                  value: Math.round(transit.event.avg_speed),
                  unit: "km/h",
                },
                {
                  label: "Max Speed",
                  value: Math.round(transit.event.max_speed),
                  unit: "km/h",
                },
                {
                  label: "Min Speed",
                  value: Math.round(transit.event.min_speed),
                  unit: "km/h",
                },
                {
                  label: "Average Timetable Offset",
                  value: Math.round(transit.event.avg_timetable_offset / 60),
                  unit: "min",
                },
                {
                  label: "Max Timetable Offset",
                  value: Math.round(transit.event.max_timetable_offset / 60),
                  unit: "min",
                },
                {
                  label: "Min Timetable Offset",
                  value: Math.round(transit.event.min_timetable_offset / 60),
                  unit: "min",
                },
                {
                  label: "Vehicle Count",
                  value: transit.event.count,
                  unit: "vehicles",
                },
              ];

              return (
                <Polyline
                  key={transit.type + transit.road_section.id + colorMode}
                  positions={transit.road_section.geom.coordinates}
                  color={getRoadColor(
                    transit.event.avg_speed,
                    colorMode,
                    transit.road_section.maxspeed?.[0],
                  )}
                  weight={5}
                >
                  <Popup>
                    <div className="w-54 text-sm text-text-base">
                      <div className="flex items-start justify-between">
                        <div className="mb-2">
                          <h3 className="text-xs mb-0.5 uppercase tracking-wider text-slate-500">
                            Road Segment
                          </h3>
                          <div className="text-xxs">{transit.road_section.location_name}</div>
                          <div className="text-text-base font-semibold mt-2">
                            Traffic Overview
                          </div>
                        </div>

                        <SpeedLimitSign
                          size={54}
                          limit={transit.road_section.maxspeed?.[0]}
                        />
                      </div>
                      <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500 bg-slate-800/30 px-2 py-1 rounded-md">
                        <span>
                          {formatDate(new Date(transit.event.window_start))}
                        </span>
                        <span>
                          {formatTime(new Date(transit.event.window_start))} -{" "}
                          {formatTime(new Date(transit.event.window_end))}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {metrics.map((m, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-md px-3 py-1 bg-slate-800/40"
                          >
                            <span className="text-xs text-slate-400">
                              {m.label}
                            </span>

                            <div className="text-right leading-none">
                              <span className="font-bold text-slate-200 text-lg">
                                {m.value}
                              </span>
                              <span className="text-xs text-slate-500 ml-1">
                                {m.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
