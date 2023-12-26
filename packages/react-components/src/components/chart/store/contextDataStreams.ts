import { DataStream } from '@iot-app-kit/core';
import { StateCreator } from 'zustand';

export interface DataStreamsData {
  highlightedDataStreams: DataStream[];
  hiddenDataStreams: DataStream[];
}

export interface DataStreamsState extends DataStreamsData {
  highlightDataStream: (datastream?: DataStream) => void;
  unHighlightDataStream: (datastream?: DataStream) => void;
  hideDataStream: (datastream?: DataStream) => void;
  unHideDataStream: (datastream?: DataStream) => void;
}

export const createDataStreamsSlice: StateCreator<DataStreamsState> = (set) => ({
  highlightedDataStreams: [],
  hiddenDataStreams: [],
  highlightDataStream: (datastream?: DataStream) =>
    set((state) => {
      if (!datastream) return state;
      return { highlightedDataStreams: [...state.highlightedDataStreams, datastream] };
    }),
  unHighlightDataStream: (datastream) =>
    set((state) => {
      if (!datastream) return state;
      return { highlightedDataStreams: state.highlightedDataStreams.filter(({ id }) => id !== datastream.id) };
    }),
  hideDataStream: (datastream?: DataStream) =>
    set((state) => {
      if (!datastream) return state;
      return { hiddenDataStreams: [...state.hiddenDataStreams, datastream] };
    }),
  unHideDataStream: (datastream) =>
    set((state) => {
      if (!datastream) return state;
      return { hiddenDataStreams: state.hiddenDataStreams.filter(({ id }) => id !== datastream.id) };
    }),
});
