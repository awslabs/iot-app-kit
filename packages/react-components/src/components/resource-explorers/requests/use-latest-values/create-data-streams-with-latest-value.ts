import type { BatchGetAssetPropertyValueSuccessEntry } from '@aws-sdk/client-iotsitewise';
import type { DataStreamRequestEntry, DataStreamResource } from './types';
import type { DataStreamResourceWithLatestValue } from '../../types/resources';

type SuccessEntry = BatchGetAssetPropertyValueSuccessEntry;

export function createDataStreamsWithLatestValue<
  DataStream extends DataStreamResource
>(
  requestEntries: readonly DataStreamRequestEntry<DataStream>[],
  successEntries: readonly SuccessEntry[]
): DataStreamResourceWithLatestValue<DataStream>[] {
  const dataStreamsWithLatestValue = requestEntries.map((requestEntry) => {
    const matchingSuccessEntry = findMatchingSuccessEntry(
      requestEntry,
      successEntries
    );
    const dataStreamWithLatestValue = createDataStreamWithLatestValue(
      requestEntry,
      matchingSuccessEntry
    );

    return dataStreamWithLatestValue;
  });

  return dataStreamsWithLatestValue;
}

function findMatchingSuccessEntry<DataStream extends DataStreamResource>(
  { entryId: requestEntryId }: DataStreamRequestEntry<DataStream>,
  successEntries: readonly SuccessEntry[]
): SuccessEntry | undefined {
  const successEntry = successEntries.find(
    ({ entryId: successEntryId }) => successEntryId === requestEntryId
  );

  return successEntry;
}

function createDataStreamWithLatestValue<DataStream extends DataStreamResource>(
  requestEntry: DataStreamRequestEntry<DataStream>,
  successEntry?: SuccessEntry
): DataStreamResourceWithLatestValue<DataStream> {
  const dataStreamWithLatestValue = {
    ...requestEntry.dataStream,
    latestValue: Object.values(
      successEntry?.assetPropertyValue?.value ?? {}
    ).at(0),
    latestValueTimestamp:
      successEntry?.assetPropertyValue?.timestamp?.timeInSeconds,
  };

  return dataStreamWithLatestValue;
}
