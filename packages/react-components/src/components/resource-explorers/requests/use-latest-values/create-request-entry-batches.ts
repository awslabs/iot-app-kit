import type { DataStreamResource, DataStreamRequestEntry } from './types';

type DataStreamRequestEntryBatch<DataStream extends DataStreamResource> =
  DataStreamRequestEntry<DataStream>[];

export function createRequestEntryBatches<
  DataStream extends DataStreamResource
>(
  dataStreams: readonly DataStream[],
  createEntryId: (dataStream: DataStream) => string
): DataStreamRequestEntryBatch<DataStream>[] {
  const requestEntries = createEntries(dataStreams, createEntryId);
  const requestEntryBatches = createBatches(requestEntries);

  return requestEntryBatches;
}

function createEntries<DataStream extends DataStreamResource>(
  dataStreams: readonly DataStream[],
  createEntryId: (resource: DataStream) => string
): readonly DataStreamRequestEntry<DataStream>[] {
  const entries = dataStreams.map((dataStream) => {
    const entryId = createEntryId(dataStream);

    const baseEntry = {
      dataStream,
      entryId,
    };

    if (dataStream.alias) {
      return { ...baseEntry, propertyAlias: dataStream.alias };
    }

    return {
      ...baseEntry,
      assetId: dataStream.assetId,
      propertyId: dataStream.propertyId,
    };
  });

  return entries;
}

function createBatches<DataStream extends DataStreamResource>(
  entries: readonly DataStreamRequestEntry<DataStream>[]
): DataStreamRequestEntryBatch<DataStream>[] {
  const batches = [];

  for (let i = 0; i < entries.length; i += 128) {
    const batch = entries.slice(i, i + 128);

    batches.push(batch);
  }

  return batches;
}
