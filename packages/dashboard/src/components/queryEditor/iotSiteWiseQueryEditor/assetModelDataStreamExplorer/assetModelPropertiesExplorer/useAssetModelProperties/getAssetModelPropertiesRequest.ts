import { ListAssetModelPropertiesCommand, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export class GetAssetModelPropertiesRequest {
  readonly #command: ListAssetModelPropertiesCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetModelId,
    nextToken,
    client,
    signal,
  }: {
    assetModelId: string;
    nextToken?: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand({ assetModelId, nextToken });
    this.#client = client;
    this.#signal = signal;
  }

  public async send() {
    try {
      const response = await this.#client.send(this.#command, { abortSignal: this.#signal });

      return response;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand({ assetModelId, nextToken }: { assetModelId: string; nextToken?: string }) {
    const command = new ListAssetModelPropertiesCommand({
      assetModelId,
      nextToken,
      maxResults: 250,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset model properties. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
