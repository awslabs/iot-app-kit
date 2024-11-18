import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import { parseDuration } from '../../common/time';
import type { DataStreamsStore, DataStreamStore } from './types';

export const getDataStreamStore = (
  dataStreamId: string,
  resolution: number | string,
  store: DataStreamsStore | undefined,
  aggregationType?: AggregateType
): DataStreamStore | undefined => {
  const resolutionStreamStore = store?.[dataStreamId]?.resolutions;
  const rawDataStreamStore = store?.[dataStreamId]?.rawData;
  const parsedDuration = parseDuration(resolution);

  if (parsedDuration === 0 && rawDataStreamStore) {
    return rawDataStreamStore;
  } else if (resolutionStreamStore && aggregationType) {
    return resolutionStreamStore[parsedDuration]?.[aggregationType];
  }

  return undefined;
};
