import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { FindModeledDataStreamRequest } from './findModeledDataStreamRequest';
import { SearchModeledDataStreamRequest } from './searchModeledDataStreamRequest';
import type { AssetId, AssetModelId, AssetPropertyId, ModeledDataStream } from './types';

export class DescribeModeledDataStreamRequest {
  #findModeledDataStreamRequest: FindModeledDataStreamRequest;
  #searchModeledDataStreamRequest: SearchModeledDataStreamRequest;

  constructor(client: IoTSiteWiseClient) {
    this.#findModeledDataStreamRequest = new FindModeledDataStreamRequest(client);
    this.#searchModeledDataStreamRequest = new SearchModeledDataStreamRequest(client);
  }

  public async send({
    assetPropertyId,
    assetId,
    assetModelId,
  }: {
    assetPropertyId: AssetPropertyId;
    assetId: AssetId;
    assetModelId: AssetModelId;
  }): Promise<ModeledDataStream | undefined | never> {
    try {
      const asset = await this.#findModeledDataStreamRequest.send(assetId);
      const assetPropertyOnAsset = this.#findAssetPropertyOnAsset({ assetPropertyId, asset });

      if (assetPropertyOnAsset) {
        const modeledDataStream = {
          ...assetPropertyOnAsset,
          assetId,
          propertyId: assetPropertyId,
          assetName: asset.assetName,
        };

        return modeledDataStream;
      }

      const foundAssetProperty = await this.#searchModeledDataStreamRequest.send({
        assetPropertyId,
        assetId,
        assetModelId,
      });

      if (foundAssetProperty) {
        const modeledDataStream = {
          ...foundAssetProperty,
          assetId,
          propertyId: assetPropertyId,
          assetName: asset.assetName,
        };

        return modeledDataStream;
      }
    } catch (error) {
      this.#handleError(error);
    }
  }

  #findAssetPropertyOnAsset({
    assetPropertyId,
    asset,
  }: {
    assetPropertyId: AssetPropertyId;
    asset: Awaited<ReturnType<FindModeledDataStreamRequest['send']>>;
  }) {
    const assetProperty = asset.assetProperties?.find(({ id }) => id === assetPropertyId);

    if (assetProperty) {
      return assetProperty;
    }

    const assetCompositeModel = asset.assetCompositeModels?.find(({ properties = [] }) => {
      return properties?.find(({ id }) => {
        return id === assetPropertyId;
      });
    });

    const assetCompositeModelProperty = assetCompositeModel?.properties?.find(({ id }) => id === assetPropertyId);

    if (assetCompositeModelProperty) {
      return assetCompositeModelProperty;
    }
  }

  #handleError(error: unknown): never {
    console.error(`Failed to describe modeled data stream. Error: ${error}`);

    throw error;
  }
}
