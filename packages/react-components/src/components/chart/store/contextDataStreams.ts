import { DataStream } from '@iot-app-kit/core';
import { StateCreator } from 'zustand';

export type DataStreamIdentity = Pick<DataStream, 'id'>;

export interface DataStreamsData {
  highlightedDataStreams: DataStreamIdentity[];
  hiddenDataStreams: DataStreamIdentity[];
}

export interface DataStreamsState extends DataStreamsData {
  highlightDataStream: (datastream?: DataStreamIdentity) => void;
  unHighlightDataStream: (datastream?: DataStreamIdentity) => void;
  hideDataStream: (datastream?: DataStreamIdentity) => void;
  unHideDataStream: (datastream?: DataStreamIdentity) => void;
}

export const createDataStreamsSlice: StateCreator<DataStreamsState> = (
  set
) => ({
  highlightedDataStreams: [],
  hiddenDataStreams: [],
  highlightDataStream: (datastream?: DataStreamIdentity) =>
    set((state) => {
      if (!datastream) return state;
      return {
        highlightedDataStreams: [...state.highlightedDataStreams, datastream],
      };
    }),
  unHighlightDataStream: (datastream) =>
    set((state) => {
      if (!datastream) return state;
      return {
        highlightedDataStreams: state.highlightedDataStreams.filter(
          ({ id }) => id !== datastream.id
        ),
      };
    }),
  hideDataStream: (datastream?: DataStreamIdentity) =>
    set((state) => {
      if (!datastream) return state;
      return {
        hiddenDataStreams: [...state.hiddenDataStreams, datastream],
        /**
         * unhighlight the datastream if it's hidden so it does not
         * make the other streams de-emphasized
         */
        highlightedDataStreams: state.highlightedDataStreams.filter(
          ({ id }) => id !== datastream.id
        ),
      };
    }),
  unHideDataStream: (datastream) =>
    set((state) => {
      if (!datastream) return state;
      return {
        hiddenDataStreams: state.hiddenDataStreams.filter(
          ({ id }) => id !== datastream.id
        ),
      };
    }),
});
