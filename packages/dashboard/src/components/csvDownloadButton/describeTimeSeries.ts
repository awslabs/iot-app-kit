import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { GetDescribeTimeSeriesCommand } from './getDescribeTimeSeriesCommand';

export class DescribeTimeSeries {
  readonly #client: IoTSiteWiseClient;
  readonly #signal: AbortSignal | undefined;
  readonly #assetId?: string;
  readonly #propertyId?: string;
  readonly #alias?: string;

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
    this.#client = client;
    this.#signal = signal;
    this.#assetId = assetId;
    this.#propertyId = propertyId;
    this.#alias = alias;
  }

  public async send(): Promise<NonNullable<Awaited<ReturnType<GetDescribeTimeSeriesCommand['send']>>>> {
    const describedTimeSeries = await this.#getDescribeTimeSeries(this.#assetId, this.#propertyId, this.#alias);

    return describedTimeSeries ?? {};
  }

  async #getDescribeTimeSeries(assetId?: string, propertyId?: string, alias?: string) {
    const request = new GetDescribeTimeSeriesCommand({
      assetId,
      propertyId,
      alias,
      client: this.#client,
      signal: this.#signal,
    });
    const res = await request.send();

    return res;
  }
}
