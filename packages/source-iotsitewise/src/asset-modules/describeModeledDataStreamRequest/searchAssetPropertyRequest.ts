import type {
  AssetPropertySummary,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { SearchAssetPropertyListsRequest } from './searchAssetPropertyListsRequest';
import { SearchAssetModelPropertyListsRequest } from './searchAssetModelPropertyListsRequest';
import type { AssetId, AssetModelId, AssetPropertyId } from './types';

export class SearchAssetPropertyRequest {
  #searchAssetPropertyListsRequest: SearchAssetPropertyListsRequest;
  #searchAssetModelPropertyListsRequest: SearchAssetModelPropertyListsRequest;

  constructor(client: IoTSiteWiseClient) {
    this.#searchAssetPropertyListsRequest = new SearchAssetPropertyListsRequest(
      client
    );
    this.#searchAssetModelPropertyListsRequest =
      new SearchAssetModelPropertyListsRequest(client);
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
      // We need both the asset property and the asset model property to get the complete asset property.
      const assetProperty = await this.#searchAssetPropertyListsRequest.send({
        assetPropertyId,
        assetId,
      });
      const assetModelProperty =
        await this.#searchAssetModelPropertyListsRequest.send({
          assetModelPropertyId: assetPropertyId,
          assetModelId,
        });

      if (assetProperty && assetModelProperty) {
        // Asset properties may override asset model properties, so we merge it second.
        return {
          ...assetModelProperty,
          ...assetProperty,
        };
      }
    } catch (error) {
      this.#handleError(error);
    }
  }

  #handleError(error: unknown): never {
    const errorMessage = `Failed to search for asset property. Error: ${error}`;
    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}
