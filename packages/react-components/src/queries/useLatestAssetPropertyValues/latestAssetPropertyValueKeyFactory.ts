import { LatestAssetPropertyValueRequest } from './types';

export const LATEST_ASSET_PROPERTY_VALUE_RESOURCE_KEY =
  'latest asset property value';

type LatestAssetPropertyValueKeyFactoryOptions =
  LatestAssetPropertyValueRequest & { refreshRate?: number };

export class LatestAssetPropertyValueKeyFactory {
  #assetId?: string;
  #propertyId?: string;
  #propertyAlias?: string;

  constructor({
    assetId,
    propertyId,
    propertyAlias,
  }: LatestAssetPropertyValueKeyFactoryOptions) {
    this.#assetId = assetId;
    this.#propertyId = propertyId;
    this.#propertyAlias = propertyAlias;
  }

  create() {
    const cacheKey = [
      {
        resource: LATEST_ASSET_PROPERTY_VALUE_RESOURCE_KEY,
        assetId: this.#assetId,
        propertyId: this.#propertyId,
        propertyAlias: this.#propertyAlias,
      },
    ] as const;

    return cacheKey;
  }
}
