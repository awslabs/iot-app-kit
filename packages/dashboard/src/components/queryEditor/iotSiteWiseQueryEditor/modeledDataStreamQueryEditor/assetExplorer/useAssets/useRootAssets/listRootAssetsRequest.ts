import {
  ListAssetsCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class ListRootAssetsRequest {
  readonly #command: ListAssetsCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    nextToken,
    client,
    signal,
  }: {
    nextToken?: string;
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
  }) {
    this.#command = this.#createCommand(nextToken);
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

  #createCommand(nextToken?: string) {
    const ROOT_ASSETS_LIST_FILTER = 'TOP_LEVEL';
    const MAX_ROOT_ASSETS_PER_PAGE = 250;
    const command = new ListAssetsCommand({
      nextToken,
      filter: ROOT_ASSETS_LIST_FILTER,
      maxResults: MAX_ROOT_ASSETS_PER_PAGE,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get root assets. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
