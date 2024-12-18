import { type AssetState } from '@aws-sdk/client-iotsitewise';
import { v4 as uuid } from 'uuid';
import type { Asset, AssetModel } from '../types';

export class AssetFactory {
  readonly #assetModel: AssetModel;

  constructor(assetModel: AssetModel) {
    this.#assetModel = assetModel;
  }

  public create({ assetName }: Pick<Asset, 'assetName'>): Asset {
    const asset = {
      ...this.#createDefaults(assetName),
      assetName,
    };

    return asset;
  }

  #createDefaults(assetName: string | undefined) {
    const assetId = uuid();
    const assetArn = `arn:aws:iotsitewise:us-east-1:123456789012:asset/${assetId}`;
    const assetModelId = this.#assetModel.assetModelId;
    const assetProperties =
      this.#assetModel.assetModelProperties?.map(({ id, name, dataType }) => ({
        id,
        name: name,
        dataType: dataType,
        path: [
          { id: assetId, name: assetName ?? '' },
          { id: id, name: name },
        ],
      })) ?? [];
    const assetHierarchies = this.#assetModel.assetModelHierarchies;
    const assetCreationDate = new Date();
    const assetLastUpdateDate = new Date();
    const assetStatus = {
      state: 'ACTIVE' as AssetState,
    };
    const defaults = {
      assetId,
      assetArn,
      assetModelId,
      assetProperties,
      assetHierarchies,
      assetCreationDate,
      assetLastUpdateDate,
      assetStatus,
    };

    return defaults;
  }
}
