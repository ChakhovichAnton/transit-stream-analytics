import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import Dialog from "./Dialog";
import Dots from "./Dots";
import Loading from "./Loading";
import { formatDateTime, pad2 } from "../utils/format";
import { DAYS_OF_THE_WEEK, getMonthGrid } from "../utils/calendar";
import type { AsyncData } from "../types";

interface DateTimeSelectorProps {
  value?: Date;
  onChange: (newDate: Date) => void;
  timesWithData: AsyncData<{ [k: string]: Date[] }>;
}

const DateTimeSelector = ({
  value,
  onChange,
  timesWithData,
}: DateTimeSelectorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState(value);
  const [viewMonth, setViewMonth] = useState(date?.getMonth());
  const [viewYear, setViewYear] = useState(date?.getFullYear());

  useEffect(() => {
    if (dialogOpen && value && timesWithData.status === "success") {
      setDate(value);
      setViewMonth(value.getMonth());
      setViewYear(value.getFullYear());
    }
  }, [dialogOpen, timesWithData.status, value]);

  const onClose = () => setDialogOpen(false);
  const onOpenDialog = () => {
    setDialogOpen(true);
    setDate(value);
  };

  const changeMonth = (delta: number) => {
    if (viewMonth === undefined || viewYear === undefined) return;

    const newDate = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(newDate.getFullYear());
    setViewMonth(newDate.getMonth());
  };

  const cells =
    viewYear !== undefined && viewMonth !== undefined
      ? getMonthGrid(viewYear, viewMonth)
      : [];

  const getTimes = (day: number | undefined = date?.getDate()) => {
    if (
      timesWithData.status !== "success" ||
      day === undefined ||
      viewMonth === undefined
    ) {
      return;
    }
    const key = viewYear + "-" + pad2(viewMonth + 1) + "-" + pad2(day);
    return timesWithData.data[key];
  };

  const getMinutes = (hour: number) => {
    return getTimes()
      ?.filter((t) => t.getHours() === hour)
      .map((t) => t.getMinutes());
  };

  const disabled = timesWithData.status !== "success";

  return (
    <>
      <div className="relative w-full">
        <div className="absolute -top-2 left-2 px-1 text-xs bg-base text-text-base font-medium">
          Selected date and time
        </div>
        <button
          className="flex justify-between items-center w-full px-3 py-2 bg-base border border-card-border-base rounded"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDialog();
          }}
          disabled={disabled}
        >
          {timesWithData.status === "error" ? (
            timesWithData.error.msg
          ) : timesWithData.status === "loading" || value === undefined ? (
            <div className="flex">
              Loading
              <Dots />
            </div>
          ) : (
            formatDateTime(value)
          )}
          <ChevronDown
            className={`${disabled ? "text-disabled-text" : ""}`}
            size={16}
          />
        </button>
      </div>
      <Dialog isOpen={dialogOpen} onClose={onClose} closeDialogButton>
        <div className="relative min-h-[30vh] h-full w-full max-w-md flex flex-col">
          {timesWithData.status === "error" ? (
            <div className="flex flex-col space-y-3 items-center justify-center">
              <h2 className="text-lg font-medium">Error</h2>
              <p>{timesWithData.error.msg}</p>
            </div>
          ) : timesWithData.status === "loading" ||
            viewMonth === undefined ||
            viewYear === undefined ||
            date === undefined ? (
            <div className="flex items-center justify-center w-full flex-1 p-4 bg-red-500">
              <Loading />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-medium mb-2">Select date and time</h2>
              <div className="flex justify-between w-full items-center mb-2 text-slate-300">
                <p className="font-medium">
                  {viewMonth + 1} / {viewYear}
                </p>
                <div>
                  <button onClick={() => changeMonth(-1)}>
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => changeMonth(1)}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-400">
                {DAYS_OF_THE_WEEK.map((day) => (
                  <div key={day} className="text-xs text-slate-500 py-1">
                    {day}
                  </div>
                ))}

                {cells.map((day, i) => {
                  const isCurrentMonth = day !== null;
                  const dayData = isCurrentMonth && getTimes(day);

                  const today = new Date();
                  const isToday =
                    isCurrentMonth &&
                    viewYear === today.getFullYear() &&
                    viewMonth === today.getMonth() &&
                    day === today.getDate();

                  const isSelected =
                    isCurrentMonth &&
                    day === date.getDate() &&
                    viewMonth === date.getMonth() &&
                    viewYear === date.getFullYear();

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!isCurrentMonth) return;

                        const newDate = new Date(date);
                        newDate.setFullYear(viewYear);
                        newDate.setMonth(viewMonth);
                        newDate.setDate(day);

                        setDate(newDate);
                      }}
                      className={`relative p-2 h-8 w-8 flex items-center justify-center rounded transition
                              ${isToday ? "border" : ""}
                              ${isSelected ? "bg-slate-700" : ""}
                              ${isCurrentMonth ? "text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer" : "text-slate-700"}`}
                    >
                      {day || ""}
                      {dayData && dayData.length > 0 && (
                        <div className="bg-red-500 absolute p-0.75 bottom-0.5 rounded" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs space-x-2 items-center">
                <div className="flex items-center gap-1">
                  <div className="bg-red-500 mx-0.5 w-2 h-2 rounded" />
                  Date with data
                </div>
                <div className="flex items-center gap-1">
                  <div className="border w-4 h-4 rounded" />
                  Today
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-slate-700" />
                  Selected
                </div>
              </div>

              {/* Time picker */}
              <div className="flex items-center gap-2 mt-3">
                <select
                  className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white"
                  value={date.getHours()}
                  onChange={(e) => {
                    const newDate = new Date(date);
                    const hour = Number(e.target.value);
                    const minutes = getMinutes(hour);
                    const hasMinutes = minutes && minutes.length > 0;

                    newDate.setHours(hour);
                    if (hasMinutes && !minutes.includes(newDate.getMinutes())) {
                      newDate.setMinutes(minutes[0], 0, 0);
                    }
                    setDate(newDate);
                  }}
                >
                  {[...Array(24).keys()]
                    .filter((h) => {
                      const times = getTimes();
                      return (
                        times && times.map((t) => t.getHours()).includes(h)
                      );
                    })
                    .map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, "0")}
                      </option>
                    ))}
                </select>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
                <select
                  className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white"
                  value={date.getMinutes()}
                  onChange={(e) => {
                    const newDate = new Date(date);
                    newDate.setMinutes(Number(e.target.value));
                    setDate(newDate);
                  }}
                >
                  {getMinutes(date.getHours())?.map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex mt-4 w-full">
                <button
                  onClick={() => {
                    onChange(date);
                    onClose();
                  }}
                  className="px-4 py-1 bg-button-blue w-full text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default DateTimeSelector;
