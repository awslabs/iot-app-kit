import {
  DescribeAssetCommand,
  type DescribeAssetCommandOutput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';

import type { Asset, AssetId } from './types';

type AssetCache = Record<AssetId, Asset>;
type PendingRequestCache = Record<AssetId, Promise<DescribeAssetCommandOutput>>;

export class DescribeAssetRequest {
  #assetCache: AssetCache = {};
  #pendingRequestCache: PendingRequestCache = {};
  #client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.#client = client;
  }

  public async send(assetId: AssetId): Promise<Asset | never> {
    const cachedAsset = this.#assetCache[assetId];

    if (cachedAsset) {
      return cachedAsset;
    }

    const cachedRequest = this.#pendingRequestCache[assetId];

    try {
      // If several requests for the same asset happen at the same time, we
      // prevent duplication of requests by reusing a cached pending promise.
      if (cachedRequest) {
        const asset = await cachedRequest;

        this.#cacheAsset(assetId, asset);
        this.#deletePendingRequest(assetId);

        return asset;
      }

      const command = this.#createCommand(assetId);
      const request = this.#client.send(command);

      this.#cachePendingRequest(assetId, request);

      const asset = await request;

      this.#cacheAsset(assetId, asset);
      this.#deletePendingRequest(assetId);

      return asset;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(assetId: AssetId) {
    const command = new DescribeAssetCommand({ assetId });

    return command;
  }

  #cacheAsset(assetId: AssetId, asset: Asset): void {
    this.#assetCache[assetId] = asset;
  }

  #cachePendingRequest(
    assetId: AssetId,
    request: Promise<DescribeAssetCommandOutput>
  ) {
    this.#pendingRequestCache[assetId] = request;
  }

  #deletePendingRequest(assetId: AssetId): void {
    delete this.#pendingRequestCache[assetId];
  }

  #handleError(error: unknown): never {
    const errorMessage = `Failed to describe asset. Error: ${error}`;
    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}
