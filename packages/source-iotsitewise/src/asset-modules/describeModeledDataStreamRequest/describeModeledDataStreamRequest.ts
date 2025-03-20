import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { DescribeAssetRequest } from './describeAssetRequest';
import { SearchAssetPropertyRequest } from './searchAssetPropertyRequest';
import type {
  Asset,
  AssetId,
  AssetModelId,
  AssetPropertyId,
  ModeledDataStream,
} from './types';

/**
 * Creates a request to return the metadata for a modeled data stream.
 *
 * @remarks
 *
 * The created request is optimized to reduce the number of requests send using
 * caching of requests and optimistic control flow.
 */
export class DescribeModeledDataStreamRequest {
  #describeAssetRequest: DescribeAssetRequest;
  #searchAssetPropertyRequest: SearchAssetPropertyRequest;

  constructor(client: IoTSiteWiseClient) {
    this.#describeAssetRequest = new DescribeAssetRequest(client);
    this.#searchAssetPropertyRequest = new SearchAssetPropertyRequest(client);
  }

  /**
   * Initiate the request to describe a modeled data stream.
   *
   * @remarks
   *
   * The request returns undefined if any exceptions are thrown to handle
   * failures gracefully.
   */
  public async send({
    assetPropertyId,
    assetId,
    assetModelId,
  }: {
    assetPropertyId: AssetPropertyId;
    assetId: AssetId;
    assetModelId: AssetModelId;
  }): Promise<ModeledDataStream | undefined> {
    try {
      const asset = await this.#describeAssetRequest.send(assetId);
      const assetPropertyOnAsset = this.#findAssetPropertyOnAsset({
        assetPropertyId,
        asset,
      });

      if (assetPropertyOnAsset) {
        return {
          ...assetPropertyOnAsset,
          assetId,
          propertyId: assetPropertyId,
          assetName: asset.assetName,
        };
      }

      const searchedAssetProperty = await this.#searchAssetPropertyRequest.send(
        {
          assetPropertyId,
          assetId,
          assetModelId,
        }
      );

      if (searchedAssetProperty) {
        return {
          ...searchedAssetProperty,
          assetId,
          propertyId: assetPropertyId,
          assetName: asset.assetName,
        };
      }
    } catch (error) {
      return this.#handleError(error);
    }
  }

  #findAssetPropertyOnAsset({
    assetPropertyId,
    asset: { assetProperties = [], assetCompositeModels = [] },
  }: {
    assetPropertyId: AssetPropertyId;
    asset: Asset;
  }) {
    const assetProperty = assetProperties.find(
      ({ id }) => id === assetPropertyId
    );

    if (assetProperty) {
      return assetProperty;
    }

    const assetCompositeModelProperty = assetCompositeModels
      .flatMap(({ properties = [] }) => properties)
      .find(({ id }) => id === assetPropertyId);

    if (assetCompositeModelProperty) {
      return assetCompositeModelProperty;
    }
  }

  #handleError(error: unknown): undefined {
    const errorMessage = `Failed to describe modeled data stream. Error: ${error}`;
    console.error(errorMessage);

    return undefined;
  }
}
