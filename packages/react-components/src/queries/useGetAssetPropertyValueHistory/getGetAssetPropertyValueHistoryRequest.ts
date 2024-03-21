import {
  GetAssetPropertyValueHistoryCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class GetGetAssetPropertyValueHistoryRequest {
  readonly #command: GetAssetPropertyValueHistoryCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetId,
    propertyId,
    startDate,
    endDate,
    nextToken,
    client,
    signal,
  }: {
    assetId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    client: IoTSiteWiseClient;
    nextToken?: string;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand({
      assetId,
      propertyId,
      startDate,
      endDate,
      nextToken,
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
    assetId,
    propertyId,
    startDate,
    endDate,
    nextToken,
  }: {
    assetId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    nextToken?: string;
  }) {
    const command = new GetAssetPropertyValueHistoryCommand({
      assetId,
      propertyId,
      startDate,
      endDate,
      nextToken,
      maxResults: 20000,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(
      `Failed to get asset property value history. Error: ${error}`
    );
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
