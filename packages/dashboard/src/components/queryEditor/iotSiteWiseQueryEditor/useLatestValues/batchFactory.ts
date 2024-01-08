import { EntryIdFactory } from './entryIdFactory';

import type { ModeledDataStream } from '../modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import type { UnmodeledDataStream } from '../unmodeledDataStreamExplorer/types';

type BatchEntry = (ModeledDataStream | UnmodeledDataStream) & {
  entryId: string;
};

export class BatchFactory {
  readonly #dataStreams: ModeledDataStream[] | UnmodeledDataStream[];
  readonly #MAX_BATCH_SIZE = 128;

  constructor(dataStreams: ModeledDataStream[] | UnmodeledDataStream[]) {
    this.#dataStreams = dataStreams;
  }

  public create(): BatchEntry[][] {
    const entries = this.#createBatchEntries();
    const batches = this.#chunkBatches(entries);

    return batches;
  }

  #createBatchEntries(): BatchEntry[] {
    const entries = this.#dataStreams.map((dataStream) => {
      const entryIdFactory = new EntryIdFactory(dataStream);

      return {
        // Each entry ID must be unique within the batch request.
        entryId: entryIdFactory.create(),
        ...dataStream,
      };
    });

    return entries;
  }

  #chunkBatches(entries: BatchEntry[]): BatchEntry[][] {
    const batches = [];

    for (let i = 0; i < entries.length; i += this.#MAX_BATCH_SIZE) {
      const chunk = entries.slice(i, i + this.#MAX_BATCH_SIZE);

      batches.push(chunk);
    }

    return batches;
  }
}
