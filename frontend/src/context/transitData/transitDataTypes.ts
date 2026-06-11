import type { AggregatedTransitResponse, AsyncData } from "../../types";

export interface TransitDataContextType {
  selectWindow: (windowLength: number) => void;
  windows: AsyncData<number[]>;
  selectedWindow?: number;
  date?: Date;
  setDate: (date: Date) => void;
  timesWithData: AsyncData<{ [k: string]: Date[] }>;
  transitData: AsyncData<AggregatedTransitResponse[]>;
}
