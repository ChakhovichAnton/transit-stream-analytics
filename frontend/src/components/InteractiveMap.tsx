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
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                          Road Segment
                        </div>
                        <div className="text-xs text-slate-300">
                          Live Traffic
                        </div>
                      </div>

                      <SpeedLimitSign
                        size={56}
                        limit={transit.road_section.maxspeed?.[0]}
                      />
                    </div>

                    <div className="bg-slate-800 rounded-lg p-2 mb-3">
                      <div className="flex items-end justify-between gap-4">
                        <span className="text-xs text-slate-400">
                          Current Speed
                        </span>

                        <span className="text-2xl font-extrabold text-white leading-none">
                          {Math.round(transit.event.avg_speed)}
                          <span className="text-xs font-medium text-slate-400 ml-1">
                            km/h
                          </span>
                        </span>
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
