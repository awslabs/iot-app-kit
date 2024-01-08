import {
  DescribeAssetCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class GetAssetRequest {
  readonly #command: DescribeAssetCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetId,
    client,
    signal,
  }: {
    assetId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand(assetId);
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

  #createCommand(assetId: string) {
    const command = new DescribeAssetCommand({ assetId });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset description. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
