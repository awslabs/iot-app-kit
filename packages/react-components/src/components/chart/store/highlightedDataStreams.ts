import { DataStream } from '@iot-app-kit/core';
import { StateCreator } from 'zustand';

export interface HighlightedDataStreamsData {
  highlightedDataStreams: DataStream[];
}

export interface HighlightedDataSteamsState extends HighlightedDataStreamsData {
  highlightDataStream: (datastream?: DataStream) => void;
  unHighlightDataStream: (datastream?: DataStream) => void;
}

export const createHighlightedDataStreamsSlice: StateCreator<HighlightedDataSteamsState> = (set) => ({
  highlightedDataStreams: [],
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
});
