import {
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import useTransitData from "../hooks/useTransitData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRoadColor } from "../utils/map";
import { useVisualizationContext } from "../context/visualizationSettings";
import SpeedLimitSign from "./SpeedLimit";

const MAP_DEFAULTS = {
  center: [60.1699, 24.9384] satisfies [number, number],
};

const InteractiveMap = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const { colorMode, setColorMode } = useVisualizationContext();
  const { status, transitData } = useTransitData();
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="w-full h-full relative">
      {/* LEFT SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ x: leftOpen ? 0 : -288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute flex z-500 h-full bg-slate-900 border-r border-slate-800 w-72"
      >
        <div className="relative w-full h-full">
          <div className="w-full p-4 space-y-4 text-sm text-white">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Road Coloring</span>
              <span className="text-xs text-slate-400">
                {colorMode.replaceAll("_", " ")}
              </span>
            </div>

            {/* PREVIEW LEGEND */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                Speeed Color Preview
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded bg-red-500" />
                <div className="flex-1 h-2 rounded bg-yellow-400" />
                <div className="flex-1 h-2 rounded bg-green-500" />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Slow</span>
                <span>Medium</span>
                <span>Fast</span>
              </div>
            </div>

            <div className="bg-slate-800 p-1 rounded-lg flex">
              <button
                onClick={() => setColorMode("SPEED_LIMIT")}
                className={`flex-1 text-xs py-1 rounded-md transition ${
                  colorMode === "SPEED_LIMIT"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Speed Limit
              </button>

              <button
                onClick={() => setColorMode("ABSOLUTE")}
                className={`flex-1 text-xs py-1 rounded-md transition ${
                  colorMode === "ABSOLUTE"
                    ? "bg-blue-800 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Absolute
              </button>
            </div>
          </div>
        </div>
        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setLeftOpen((v) => !v)}
          className="absolute text-white right-0 translate-x-full top-1/2 -translate-y-1/2 bg-slate-900 border-r border-y border-slate-800 py-1.5 rounded-r-full"
        >
          {leftOpen ? <ChevronLeft size={30} /> : <ChevronRight size={30} />}
        </button>
      </motion.aside>
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
        {status === "success" && transitData.length > 0 && (
          <>
            {transitData.map((transit) => {
              return (
                <Polyline
                  key={transit.type + transit.road_section.id + colorMode}
                  positions={transit.road_section.geom.coordinates}
                  color={getRoadColor(
                    transit.event.speed,
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
                          {Math.round(transit.event.speed)}
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
