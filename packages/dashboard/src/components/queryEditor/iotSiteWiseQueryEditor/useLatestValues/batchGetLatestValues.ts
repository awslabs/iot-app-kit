import {
  BatchGetAssetPropertyValueCommand,
  type IoTSiteWiseClient,
  type BatchGetAssetPropertyValueCommandInput,
} from '@aws-sdk/client-iotsitewise';

export class BatchGetLatestValuesRequest {
  readonly #client: IoTSiteWiseClient;
  readonly #command: BatchGetAssetPropertyValueCommand;
  readonly #signal: AbortSignal | undefined;

  constructor({
    entries,
    client,
    signal,
  }: {
    entries: BatchGetAssetPropertyValueCommandInput['entries'];
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand(entries);
    this.#client = client;
    this.#signal = signal;
  }

  public async send() {
    try {
      const response = await this.#client.send(this.#command, {
        abortSignal: this.#signal,
      });

      return response;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(entries: BatchGetAssetPropertyValueCommandInput['entries']) {
    const command = new BatchGetAssetPropertyValueCommand({ entries });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get latest values. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
