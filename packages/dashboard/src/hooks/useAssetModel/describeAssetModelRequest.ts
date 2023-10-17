import { DescribeAssetModelCommand, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

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
      const response = await this.#client.send(this.#command, { abortSignal: this.#signal });

      return response;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(assetModelId?: string) {
    const command = new DescribeAssetModelCommand({
      assetModelId,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset model. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
