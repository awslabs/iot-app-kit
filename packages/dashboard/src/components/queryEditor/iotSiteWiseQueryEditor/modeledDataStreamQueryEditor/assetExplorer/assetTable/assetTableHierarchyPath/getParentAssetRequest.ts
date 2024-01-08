import {
  ListAssociatedAssetsCommand,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

export class GetParentAssetRequest {
  readonly #command: ListAssociatedAssetsCommand;
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
    const TRAVERSAL_DIRECTION = 'PARENT';
    const MAX_RESULTS = 1;
    const command = new ListAssociatedAssetsCommand({
      traversalDirection: TRAVERSAL_DIRECTION,
      maxResults: MAX_RESULTS,
      assetId,
    });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get parent asset. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
