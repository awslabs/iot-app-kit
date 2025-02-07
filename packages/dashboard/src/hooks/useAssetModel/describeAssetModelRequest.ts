import {
  DescribeAssetModelCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class DescribeAssetModelRequest {
  readonly #signal: AbortSignal | undefined;
  readonly #client: IoTSiteWiseClient;
  #command: DescribeAssetModelCommand;

  constructor({
    assetModelId,
    client,
    signal,
  }: {
    assetModelId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#signal = signal;
    this.#client = client;
    this.#command = this.#createCommand(assetModelId);
  }

  public async send() {
    try {
      return this.#client.send(this.#command, {
        abortSignal: this.#signal,
      });
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(assetModelId?: string) {
    return new DescribeAssetModelCommand({
      assetModelId,
    });
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset model. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
