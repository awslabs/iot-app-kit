import {
  ListTimeSeriesCommand,
  type ListTimeSeriesCommandInput,
  type TimeSeriesSummary,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

import type { UnmodeledDataStream } from '../types';

export class ListUnmodeledDataStreamsRequest {
  readonly #command: ListTimeSeriesCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal?: AbortSignal;

  constructor({
    aliasPrefix,
    nextToken,
    client,
    signal,
  }: {
    aliasPrefix?: string;
    nextToken?: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand({ aliasPrefix, nextToken });
    this.#client = client;
    this.#signal = signal;
  }

  public async send() {
    try {
      const { TimeSeriesSummaries = [], nextToken } = await this.#client.send(
        this.#command,
        {
          abortSignal: this.#signal,
        }
      );
      const unmodeledDataStreams = this.#formatDataStreams(TimeSeriesSummaries);

      return { unmodeledDataStreams, nextToken };
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand({
    aliasPrefix,
    nextToken,
  }: Pick<ListTimeSeriesCommandInput, 'aliasPrefix' | 'nextToken'>) {
    return new ListTimeSeriesCommand({
      timeSeriesType: 'DISASSOCIATED',
      aliasPrefix,
      nextToken,
    });
  }

  #formatDataStreams(rawDataStreams: TimeSeriesSummary[]) {
    const cookedDataStreams = rawDataStreams.map<UnmodeledDataStream>(
      ({ alias, dataType, dataTypeSpec }) => ({
        alias,
        dataType,
        dataTypeSpec,
      })
    );

    return cookedDataStreams;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get unmodeled data streams. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
