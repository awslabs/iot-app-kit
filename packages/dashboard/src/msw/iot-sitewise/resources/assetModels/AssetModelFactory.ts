import { v4 as uuid } from 'uuid';

import type { AssetModel } from '../types';

export class AssetModelFactory {
  public create(partialAssetModel?: Partial<AssetModel>): AssetModel {
    const assetModelDescription = {
      ...this.#createDefaults(),
      ...partialAssetModel,
    };

    return assetModelDescription;
  }

  #createDefaults(
    {
      assetModelId,
      assetModelName,
      assetModelDescription,
      assetModelHierarchies,
      assetModelCompositeModels,
      assetModelProperties,
      assetModelCreationDate,
      assetModelLastUpdateDate,
      assetModelStatus,
    }: Partial<AssetModel> = {
      assetModelId: uuid(),
      assetModelName: 'Asset Model',
      assetModelDescription: 'Asset Model Description',
      assetModelHierarchies: [],
      assetModelCompositeModels: [],
      assetModelProperties: [],
      assetModelCreationDate: new Date(),
      assetModelLastUpdateDate: new Date(),
      assetModelStatus: {
        state: 'ACTIVE',
      },
    }
  ) {
    const assetModelArn = `arn:aws:iotsitewise:us-east-1:123456789012:asset-model/${assetModelId}`;
    const defaults = {
      assetModelId: assetModelId ?? uuid(),
      assetModelArn,
      assetModelName,
      assetModelDescription,
      assetModelHierarchies,
      assetModelCompositeModels,
      assetModelProperties,
      assetModelCreationDate,
      assetModelLastUpdateDate,
      assetModelStatus,
    };

    return defaults;
  }
}
