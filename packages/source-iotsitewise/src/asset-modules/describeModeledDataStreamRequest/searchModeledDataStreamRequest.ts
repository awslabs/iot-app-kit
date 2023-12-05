import { type IoTSiteWiseClient, type AssetPropertySummary } from '@aws-sdk/client-iotsitewise';

import { SearchAssetPropertyRequest } from './searchAssetPropertyRequest';
import { SearchAssetModelPropertyRequest } from './searchAssetModelPropertyRequest';
import type { AssetId, AssetModelId, AssetPropertyId } from './types';

export class SearchModeledDataStreamRequest {
  #searchAssetPropertyRequest: SearchAssetPropertyRequest;
  #searchAssetModelPropertyRequest: SearchAssetModelPropertyRequest;

  constructor(client: IoTSiteWiseClient) {
    this.#searchAssetPropertyRequest = new SearchAssetPropertyRequest(client);
    this.#searchAssetModelPropertyRequest = new SearchAssetModelPropertyRequest(client);
  }

  public async send({
    assetPropertyId,
    assetId,
    assetModelId,
  }: {
    assetPropertyId: AssetPropertyId;
    assetId: AssetId;
    assetModelId: AssetModelId;
  }): Promise<AssetPropertySummary | undefined | never> {
    try {
      const assetProperty = await this.#searchAssetPropertyRequest.send({ assetPropertyId, assetId });
      const assetModelProperty = await this.#searchAssetModelPropertyRequest.send({
        assetModelPropertyId: assetPropertyId,
        assetModelId,
      });

      if (assetProperty && assetModelProperty) {
        const modeledDataStream = {
          ...assetModelProperty,
          ...assetProperty,
        };

        return modeledDataStream;
      }
    } catch (error) {
      this.#handleError(error);
    }
  }

  #handleError(error: unknown): never {
    console.error(`Failed to search modeled data streams. Error: ${error}`);

    throw error;
  }
}
