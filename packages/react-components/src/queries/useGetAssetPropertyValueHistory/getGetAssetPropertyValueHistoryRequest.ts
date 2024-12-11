import {
  GetAssetPropertyValueHistoryCommand,
  type GetAssetPropertyValueHistoryCommandOutput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { compact } from '@iot-app-kit/helpers';

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

  public async send(
    fetchAll?: boolean
  ): Promise<GetAssetPropertyValueHistoryCommandOutput> {
    const responses: GetAssetPropertyValueHistoryCommandOutput[] = [];
    let nextToken = this.#command.input.nextToken;

    try {
      do {
        this.#command.input.nextToken = nextToken;
        const response = await this.#client.send(this.#command, {
          abortSignal: this.#signal,
        });
        nextToken = response.nextToken;
        responses.push(response);
      } while (fetchAll && nextToken);
      const lastResponse = responses.at(-1);

      if (!lastResponse) {
        throw new Error('Error fetching all asset property values');
      }

      const assetPropertyValueHistory = compact(
        responses.flatMap(
          ({ assetPropertyValueHistory }) => assetPropertyValueHistory
        )
      );

      return {
        ...lastResponse,
        assetPropertyValueHistory,
      };
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
