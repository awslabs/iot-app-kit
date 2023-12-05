import {
  DescribeAssetCommand,
  type IoTSiteWiseClient,
  type DescribeAssetCommandOutput,
} from '@aws-sdk/client-iotsitewise';

import type { AssetId } from './types';

export class FindModeledDataStreamRequest {
  #cache: Record<AssetId, DescribeAssetCommandOutput> = {};
  #client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.#client = client;
  }

  public async send(assetId: AssetId): Promise<DescribeAssetCommandOutput | never> {
    try {
      if (this.#cache[assetId]) {
        return this.#cache[assetId];
      }

      const command = this.#createCommand(assetId);
      const response = await this.#client.send(command);

      this.#cache[assetId] = response;

      return response;
    } catch (error) {
      this.#handleError(error);
    }
  }

  #createCommand(assetId: AssetId) {
    const command = new DescribeAssetCommand({ assetId });

    return command;
  }

  #handleError(error: unknown): never {
    console.error(`Failed to describe asset. Error: ${error}`);

    throw error;
  }
}
