import { DataStreamsStore, DataStreamStore } from './types';
import { parseDuration } from '../../common/time';

export const getDataStreamStore = (
  dataStreamId: string,
  resolution: number | string,
  store: DataStreamsStore | undefined
): DataStreamStore | undefined => {
  const resolutionCache = store && store[dataStreamId];
  if (resolutionCache == null) {
    return undefined;
  }
  return resolutionCache[parseDuration(resolution)];
};
