import {
  DescribeAssetModelCompositeModelCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class GetDescribeAssetCompositeModelRequest {
  readonly #command: DescribeAssetModelCompositeModelCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetModelId,
    assetModelCompositeModelId,
    client,
    signal,
  }: {
    assetModelId: string;
    assetModelCompositeModelId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand({
      assetModelId,
      assetModelCompositeModelId,
    });
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

  #createCommand({
    assetModelId,
    assetModelCompositeModelId,
  }: {
    assetModelId: string;
    assetModelCompositeModelId: string;
  }) {
    const command = new DescribeAssetModelCompositeModelCommand({
      assetModelId,
      assetModelCompositeModelId,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset model composite model. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
