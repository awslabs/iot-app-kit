import { DataPoint } from '@synchro-charts/core';
import { DataStreamsStore, DataStreamStore } from './types';
import { isDefined } from '../../common/predicates';
import { DataStream, RequestInformation } from '../types';
import { parseDuration } from '../../common/time';

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
    const streamsResolutions = dataStreamsStores[info.id] || {};
    const resolutions = Object.keys(streamsResolutions) as unknown as number[];
    const aggregatedData = resolutions
      .map((resolution) => streamsResolutions[resolution])
      .filter(isDefined)
      .filter(({ resolution }) => resolution > 0);

    const aggregates = aggregatedData.reduce(
      (all, currStore) => ({
        ...all,
        [currStore.resolution]: currStore.dataCache.items.flat(),
      }),
      {}
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataCache, requestCache, requestHistory, ...restOfStream } = streamsResolutions[
      parseDuration(info.resolution)
    ] as DataStreamStore;

    const rawData: DataPoint[] = streamsResolutions[0] ? streamsResolutions[0].dataCache.items.flat() : [];

    // Create new data stream for the corresponding info
    return {
      ...restOfStream,
      id: info.id,
      refId: info.refId,
      resolution: parseDuration(info.resolution),
      data: rawData,
      aggregates,
    };
  });
};
