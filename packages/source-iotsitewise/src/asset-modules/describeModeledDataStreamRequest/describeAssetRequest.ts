import { DescribeAssetCommand, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import type { Asset, AssetId } from './types';

type AssetCache = Record<AssetId, Asset>;

export class DescribeAssetRequest {
  #cache: AssetCache = {};
  #client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.#client = client;
  }

  public async send(assetId: AssetId): Promise<Asset | never> {
    const cachedAsset = this.#cache[assetId];

    if (cachedAsset) {
      return cachedAsset;
    }

    const command = this.#createCommand(assetId);

    try {
      const asset = await this.#client.send(command);

      this.#cacheAsset(assetId, asset);

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
    this.#cache[assetId] = asset;
  }

  #handleError(error: unknown): never {
    const errorMessage = `Failed to describe asset. Error: ${error}`;
    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}
