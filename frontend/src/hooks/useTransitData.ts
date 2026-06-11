import { useState, useEffect } from "react";

import type {
  AsyncData,
  DataDateMode,
  AggregatedTransitResponse,
} from "../types";
import { getAggregatedTransitData } from "../services/transitService";
import { AsyncDataHelpers } from "../utils/asyncData";

const useTransitData = (
  dataDateMode: DataDateMode,
  window?: number,
  date?: Date,
) => {
  const [transitData, setTransitData] = useState<
    AsyncData<AggregatedTransitResponse[]>
  >({
    status: "loading",
  });

  useEffect(() => {
    const getTransitData = async () => {
      if (window === undefined || date === undefined) return;

      setTransitData(AsyncDataHelpers.loading());
      try {
        const data = await getAggregatedTransitData(
          window,
          date.getTime(),
          dataDateMode,
        );
        setTransitData(AsyncDataHelpers.success(data));
      } catch (e) {
        setTransitData(AsyncDataHelpers.error(e));
      }
    };

    getTransitData();
  }, [window, date, dataDateMode]);

  return { transitData };
};

export default useTransitData;
