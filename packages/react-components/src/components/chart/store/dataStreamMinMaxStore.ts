import { StateCreator } from 'zustand';

export type MinMaxMap = { [key in string]: number };

export interface MinMaxData {
  dataStreamMaxes: MinMaxMap;
  dataStreamMins: MinMaxMap;
}

export interface MinMaxState extends MinMaxData {
  setMax: (datastreamId: string, maxValue: number) => void;
  setMin: (datastreamId: string, minValue: number) => void;
}

export const createMinMaxSlice: StateCreator<MinMaxState> = (set) => ({
  dataStreamMaxes: {},
  dataStreamMins: {},
  setMax: (datastreamId, value) =>
    set((state) => ({
      dataStreamMaxes: {
        ...state.dataStreamMaxes,
        [datastreamId]: value,
      },
    })),
  setMin: (datastreamId, value) =>
    set((state) => ({
      dataStreamMins: {
        ...state.dataStreamMins,
        [datastreamId]: value,
      },
    })),
});
