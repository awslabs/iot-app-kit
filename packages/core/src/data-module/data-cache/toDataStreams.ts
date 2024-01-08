import { parseDuration } from '../../common/time';
import type { DataStreamsStore, DataStreamStore } from './types';
import type { DataStream, RequestInformation, DataPoint } from '../types';

/**
 * To Data Streams
 *
 * Returns the data streams, with the various resolutions of data collapsed into a single corresponding data stream.
 */
export const toDataStreams = ({
  requestInformations,
  dataStreamsStores,
}: {
  requestInformations: RequestInformation[];
  dataStreamsStores: DataStreamsStore;
}): DataStream[] => {
  return requestInformations.map((info) => {
    const { aggregationType, resolution } = info;
    const resolutionStreamStore = dataStreamsStores[info.id]?.resolutions || {};
    const rawDataStreamStore = dataStreamsStores[info.id]?.rawData;
    const parsedResolution = parseDuration(resolution);

    const {
      dataCache,
      requestCache: _requestCache,
      requestHistory: _requestHistory,
      ...restOfStream
    } = (aggregationType &&
      (resolutionStreamStore[parsedResolution]?.[
        aggregationType
      ] as DataStreamStore)) ||
    rawDataStreamStore ||
    {};

    const dataPoints: DataPoint[] = dataCache?.items.flat() || [];

    // Create new data stream for the corresponding info
    return {
      ...restOfStream,
      id: info.id,
      refId: info.refId,
      resolution: parsedResolution,
      data: dataPoints,
    };
  });
};
