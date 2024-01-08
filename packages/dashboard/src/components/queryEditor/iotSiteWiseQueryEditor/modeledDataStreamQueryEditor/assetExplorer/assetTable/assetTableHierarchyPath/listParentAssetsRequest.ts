import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { GetParentAssetRequest } from './getParentAssetRequest';

export class ListParentAssetsRequest {
  readonly #assetId: string;
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
    this.#assetId = assetId;
    this.#client = client;
    this.#signal = signal;
  }

  public async send(): Promise<
    NonNullable<
      Awaited<ReturnType<GetParentAssetRequest['send']>>['assetSummaries']
    >
  > {
    const parentAssets = await this.#recursivelyGetParentAssets(this.#assetId);

    return parentAssets ?? [];
  }

  async #recursivelyGetParentAssets(
    assetId: string,
    parentAssets: Awaited<
      ReturnType<GetParentAssetRequest['send']>
    >['assetSummaries'] = []
  ): Promise<
    Awaited<ReturnType<GetParentAssetRequest['send']>>['assetSummaries']
  > {
    const parentAsset = await this.#getParentAsset(assetId);

    // termination condition
    if (parentAsset == null || parentAsset.id == null) {
      return parentAssets;
    }

    // build up the list of parent assets recursively
    return this.#recursivelyGetParentAssets(parentAsset.id, [
      parentAsset,
      ...parentAssets,
    ]);
  }

  async #getParentAsset(assetId: string) {
    const request = new GetParentAssetRequest({
      assetId,
      client: this.#client,
      signal: this.#signal,
    });
    const { assetSummaries: [parentAsset] = [] } = await request.send();

    return parentAsset;
  }
}
