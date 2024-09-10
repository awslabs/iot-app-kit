import { Viewport } from '@iot-app-kit/core';
import { HistoricalAssetPropertyValueRequest } from './types';
import { Quality, TimeOrdering } from '@aws-sdk/client-iotsitewise';

export const HISTORICAL_ASSET_PROPERTY_VALUE_RESOURCE_KEY =
  'historical asset property value';

type HistoricalAssetPropertyValueKeyFactoryOptions =
  HistoricalAssetPropertyValueRequest & { refreshRate?: number };

export class HistoricalAssetPropertyValueKeyFactory {
  #assetId?: string;
  #propertyId?: string;
  #propertyAlias?: string;
  #qualities?: Quality[];
  #timeOrdering?: TimeOrdering;

  #viewport?: Viewport;

  constructor({
    assetId,
    propertyId,
    propertyAlias,
    qualities,
    timeOrdering,
    viewport,
  }: HistoricalAssetPropertyValueKeyFactoryOptions) {
    this.#assetId = assetId;
    this.#propertyId = propertyId;
    this.#propertyAlias = propertyAlias;
    this.#qualities = qualities;
    this.#timeOrdering = timeOrdering;

    this.#viewport = viewport;
  }

  create() {
    const cacheKey = [
      {
        resource: HISTORICAL_ASSET_PROPERTY_VALUE_RESOURCE_KEY,
        assetId: this.#assetId,
        propertyId: this.#propertyId,
        propertyAlias: this.#propertyAlias,
        qualities: this.#qualities,
        timeOrdering: this.#timeOrdering,
        viewport: this.#viewport,
      },
    ] as const;

    return cacheKey;
  }
}
