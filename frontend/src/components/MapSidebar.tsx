import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useVisualizationContext } from "../context/visualizationSettings";
import Select from "./Select";
import DateTimeSelector from "./DateTimeSelector";
import { useTransitDataContext } from "../context/transitData";

const MapSidebar = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const { colorMode, setColorMode } = useVisualizationContext();
  const {
    selectWindow,
    selectedWindow,
    windows,
    date,
    setDate,
    timesWithData,
  } = useTransitDataContext();

  return (
    <motion.aside
      initial={false}
      animate={{ x: leftOpen ? 0 : -288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute flex z-500 h-full bg-slate-900 border-r border-slate-800 w-72"
    >
      <div className="relative w-full h-full">
        <div className="w-full p-3 rounded-xl bg-slate-900 text-xs text-white space-y-3">
          <div className="flex items-start justify-between">
            <span className="font-medium">Road Coloring</span>

            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-linear-to-r from-red-500 via-yellow-400 to-green-500" />

              <div className="flex justify-between gap-7 text-[10px] text-slate-400">
                <span>Slow</span>
                <span>Medium</span>
                <span>Fast</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-0.5 flex">
            <button
              onClick={() => setColorMode("SPEED_LIMIT")}
              className={`flex-1 py-1 rounded-md transition ${
                colorMode === "SPEED_LIMIT"
                  ? "bg-button-blue  text-white"
                  : "text-slate-400"
              }`}
            >
              Speed limit
            </button>

            <button
              onClick={() => setColorMode("ABSOLUTE")}
              className={`flex-1 py-1 rounded-md transition ${
                colorMode === "ABSOLUTE"
                  ? "bg-button-blue  text-white"
                  : "text-slate-400"
              }`}
            >
              Absolute
            </button>
          </div>
        </div>
        <div className="text-white p-4">
          <h2>Mode Selector</h2>
          <p>Select date and time</p>
          <div className="flex gap-2 p-1 w-full bg-card">
            <button className="flex-1 bg-button-blue text-xs py-1 rounded-md transition">
              Strict
            </button>
            <button>Latest available</button>
          </div>
          <Select
            value={selectedWindow ?? 0}
            onChange={(value) => selectWindow(value)}
            options={
              windows.status === "error"
                ? [
                    {
                      value: 0,
                      label: windows.error.msg,
                    },
                  ]
                : windows.status === "loading"
                  ? []
                  : windows.data?.map((window) => {
                      return { value: window, label: window / 60 + " min" };
                    })
            }
            label="Selected window length"
            loading={windows.status === "loading"}
            error={windows.status === "error"}
          />
          <DateTimeSelector
            value={date}
            onChange={setDate}
            timesWithData={timesWithData}
          />
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
  );
};

export default MapSidebar;
