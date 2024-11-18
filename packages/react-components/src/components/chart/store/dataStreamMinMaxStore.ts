import { type StateCreator } from 'zustand';

export type MinMaxMap = { [key in string]: number | undefined };

export interface MinMaxData {
  dataStreamMaxes: MinMaxMap;
  dataStreamMins: MinMaxMap;
}

export interface MinMaxState extends MinMaxData {
  setMaxes: (datastreamMaxes: MinMaxMap) => void;
  setMins: (datastreamMins: MinMaxMap) => void;
}

export const createMinMaxSlice: StateCreator<MinMaxState> = (set) => ({
  dataStreamMaxes: {},
  dataStreamMins: {},
  setMaxes: (datastreamMaxes) =>
    set(() => ({
      dataStreamMaxes: {
        ...datastreamMaxes,
      },
    })),
  setMins: (datastreamMins) =>
    set(() => ({
      dataStreamMins: {
        ...datastreamMins,
      },
    })),
});
