import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import type { PageStatus, TransitResponse } from "../types";
import { getLatestTransitData } from "../services/transitService";

const useTransitData = () => {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [transitData, setTransit] = useState<TransitResponse[]>([]);

  useEffect(() => {
    const getTransitData = async () => {
      setStatus("loading");
      try {
        const transit = await getLatestTransitData();
        setTransit(transit);
        setStatus("success");
      } catch (e) {
        if (isAxiosError(e) && e.status === 404) {
          setStatus("notFound");
        } else {
          setStatus("error");
        }
      }
    };

    getTransitData();
  }, []);

  return { status, transitData };
};

export default useTransitData;
