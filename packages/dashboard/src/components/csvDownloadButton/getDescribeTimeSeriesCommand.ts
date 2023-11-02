import { DescribeTimeSeriesCommand, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

export class GetDescribeTimeSeriesCommand {
  readonly #command: DescribeTimeSeriesCommand;
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;

  constructor({
    assetId,
    propertyId,
    alias,
    client,
    signal,
  }: {
    client: IoTSiteWiseClient;
    signal?: AbortSignal;
    assetId?: string;
    propertyId?: string;
    alias?: string;
  }) {
    this.#command = this.#createCommand(assetId, propertyId, alias);
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

  #createCommand(assetId?: string, propertyId?: string, alias?: string) {
    const command = new DescribeTimeSeriesCommand({ assetId, propertyId, alias });
    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to get described time series. Error: ${error}`);
    console.info('Request input:');
    console.table(this.#command.input);

    throw error;
  }
}
