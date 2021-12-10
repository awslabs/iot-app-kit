import { DataStreamsStore, DataStreamStore } from './types';

export const getDataStreamStore = (
  dataStreamId: string,
  resolution: number,
  store: DataStreamsStore | undefined
): DataStreamStore | undefined => {
  const resolutionCache = store && store[dataStreamId];
  if (resolutionCache == null) {
    return undefined;
  }
  return resolutionCache[resolution];
};
