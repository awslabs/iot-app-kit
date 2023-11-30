import { StateCreator } from 'zustand';

type YAxisValue = {
  value: number;
  color?: string;
  significantDigits?: number;
};
export type YAxisMap = { [key in string]: YAxisValue };

export interface MultiYAxisData {
  yMaxes: YAxisMap;
  yMins: YAxisMap;
}

export interface MultiYAxisState extends MultiYAxisData {
  setYMax: (datastreamId: string, yAxisValue: YAxisValue) => void;
  setYMin: (datastreamId: string, yAxisValue: YAxisValue) => void;
  clearYAxis: (datastreamId: string) => void;
}

type RemoveKeyOptions = {
  map: YAxisMap;
  datastreamId: string;
};
const removeKey = ({ map, datastreamId }: RemoveKeyOptions) => {
  const mapCopy = { ...map };
  delete mapCopy[datastreamId];
  return mapCopy;
};

export const createMultiYAxisSlice: StateCreator<MultiYAxisState> = (set) => ({
  yMaxes: {},
  yMins: {},
  setYMax: (datastreamId, value) =>
    set((state) => ({
      yMaxes: {
        ...state.yMaxes,
        [datastreamId]: value,
      },
    })),
  setYMin: (datastreamId, value) =>
    set((state) => ({
      yMins: {
        ...state.yMins,
        [datastreamId]: value,
      },
    })),
  clearYAxis: (datastreamId) =>
    set((state) => ({
      yMins: removeKey({ map: state.yMins, datastreamId }),
      yMaxes: removeKey({ map: state.yMaxes, datastreamId }),
    })),
});
