import { type PropsWithChildren, useEffect, useState, useMemo } from "react";

import type { AsyncData, DataDateMode, TimeWithData } from "../../types";
import { getDates, getWindowLengths } from "../../services/transitService";
import useTransitData from "../../hooks/useTransitData";
import { TransitDataContext } from "./transitDataContext";
import { AsyncDataHelpers } from "../../utils/asyncData";

export const TransitDataProvider = (props: PropsWithChildren) => {
  const [windows, setWindows] = useState<AsyncData<number[]>>({
    status: "loading",
  });
  const [selectedWindow, setSelectedWindow] = useState<number>();
  const [timesWithData, setTimesWithData] = useState<AsyncData<TimeWithData[]>>(
    { status: "loading" },
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dataDateMode, setDataDateMode] = useState<DataDateMode>("LATEST");
  const { transitData } = useTransitData(
    dataDateMode,
    selectedWindow,
    selectedDate,
  );

  useEffect(() => {
    const getWindows = async () => {
      try {
        setWindows(AsyncDataHelpers.loading());
        const windows = await getWindowLengths();
        setWindows(AsyncDataHelpers.success(windows));
        setSelectedWindow(windows.at(0));
      } catch (e) {
        setWindows(AsyncDataHelpers.error(e));
      }
    };

    getWindows();
  }, []);

  useEffect(() => {
    const handleDates = async () => {
      if (selectedWindow === undefined) return;
      try {
        setTimesWithData(AsyncDataHelpers.loading());
        const dates = await getDates(selectedWindow);
        setTimesWithData(AsyncDataHelpers.success(dates));

        const latestDate = dates.at(-1)?.times.at(-1);
        setSelectedDate(latestDate);
      } catch (e) {
        setTimesWithData(AsyncDataHelpers.error(e));
      }
    };

    handleDates();
  }, [selectedWindow]);

  const outputDate = useMemo(() => {
    if (selectedDate === undefined) return;
    const d = new Date(selectedDate);
    d.setSeconds(0, 0);
    return d;
  }, [selectedDate]);

  const dataTimes = useMemo(() => {
    if (timesWithData.status !== "success") return timesWithData;

    const dateMapping = Object.fromEntries(
      timesWithData.data.map((value) => [value.date, value.times]),
    );

    return AsyncDataHelpers.success(dateMapping);
  }, [timesWithData]);

  return (
    <TransitDataContext.Provider
      value={{
        windows,
        selectedWindow,
        selectWindow: setSelectedWindow,
        date: outputDate,
        setDate: setSelectedDate,
        timesWithData: dataTimes,
        transitData,
        dataDateMode,
        setDataDateMode,
      }}
    >
      {props.children}
    </TransitDataContext.Provider>
  );
};
