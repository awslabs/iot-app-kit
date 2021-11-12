import { DataStreamsStore, DataStreamStore } from './types';

export const getDataStreamStore = (
  dataStreamId: string,
  resolution: number,
  store: DataStreamsStore
): DataStreamStore | undefined => {
  const resolutionCache = store[dataStreamId];
  if (resolutionCache == null) {
    return undefined;
  }
  return resolutionCache[resolution];
};
