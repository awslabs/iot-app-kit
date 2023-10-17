import { ListAssetModelsCommand, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export class GetAssetModelsRequest {
  readonly #command: ListAssetModelsCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({ nextToken, client, signal }: { nextToken?: string; client: IoTSiteWiseClient; signal?: AbortSignal }) {
    this.#command = this.#createCommand(nextToken);
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

  #createCommand(nextToken?: string) {
    const command = new ListAssetModelsCommand({
      nextToken,
      maxResults: 250,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get asset models. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
