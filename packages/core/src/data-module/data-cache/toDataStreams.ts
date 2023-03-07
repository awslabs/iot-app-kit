import { DataStreamsStore, DataStreamStore } from './types';
import { isDefined } from '../../common/predicates';
import { DataStream, RequestInformation, DataPoint } from '../types';
import { parseDuration } from '../../common/time';
import { AggregateType } from '@aws-sdk/client-iotsitewise';

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
    const resolutionStreamStore = dataStreamsStores[info.id]?.resolutions || {};
    const rawDataStreamStore = dataStreamsStores[info.id]?.rawData;
    const resolutions = Object.keys(resolutionStreamStore) as unknown as number[];

    const aggregatedData = resolutions
      .map((res) => resolutionStreamStore[res])
      .filter(isDefined)
      .map((aggStream) => aggStream[AggregateType.AVERAGE]) // just retrieving AVERAGE for now since its the only one we support
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
    const { dataCache, requestCache, aggregationType, requestHistory, ...restOfStream } =
      (resolutionStreamStore[parseDuration(info.resolution)]?.[AggregateType.AVERAGE] as DataStreamStore) ||
      rawDataStreamStore ||
      {};

    const rawData: DataPoint[] = rawDataStreamStore ? rawDataStreamStore.dataCache.items.flat() : [];

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
