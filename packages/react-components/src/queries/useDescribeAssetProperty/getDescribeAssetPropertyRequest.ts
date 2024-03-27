import {
  DescribeAssetPropertyCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class GetDescribeAssetPropertyRequest {
  readonly #command: DescribeAssetPropertyCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetId,
    propertyId,
    client,
    signal,
  }: {
    assetId: string;
    propertyId: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand({ assetId, propertyId });
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
    assetId,
    propertyId,
  }: {
    assetId: string;
    propertyId: string;
  }) {
    const command = new DescribeAssetPropertyCommand({
      assetId,
      propertyId,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to describe asset property. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
