import {
  type AssetModelSummary,
  type AssetSummary,
  type AssetPropertySummary,
  type AssetModelPropertySummary,
  type TimeSeriesSummary,
} from '@aws-sdk/client-iotsitewise';
import type {
  ListAssetModelProperties,
  ListAssetModels,
  ListAssetProperties,
  ListAssets,
  ListTimeSeries,
} from '../../types/request-fn';

export const fakeAssetModelSummaries = [
  {
    arn: 'arn',
    id: 'asset-model-1',
    name: 'Asset Model 1',
    description: 'description',
    creationDate: new Date(0),
    lastUpdateDate: new Date(1),
    status: {
      state: 'ACTIVE',
    },
  },
  {
    arn: 'arn',
    id: 'asset-model-2',
    name: 'Asset Model 2',
    description: 'description',
    creationDate: new Date(0),
    lastUpdateDate: new Date(1),
    status: {
      state: 'ACTIVE',
    },
  },
  {
    arn: 'arn',
    id: 'asset-model-3',
    name: 'Asset Model 3',
    description: 'description',
    creationDate: new Date(0),
    lastUpdateDate: new Date(1),
    status: {
      state: 'ACTIVE',
    },
  },
] satisfies AssetModelSummary[];

export const fakeListAssetModelsResponse = {
  assetModelSummaries: fakeAssetModelSummaries,
} satisfies Awaited<ReturnType<ListAssetModels>>;

export function createListAssetModelsPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const assetModelSummaries = new Array(pageSize).fill(null).map((_, index) => {
    const uniqueId = index + startIndex;

    return {
      arn: 'arn',
      id: `asset-model-${uniqueId}`,
      name: `Asset Model ${uniqueId}`,
      description: `Description ${uniqueId}`,
      creationDate: new Date(0),
      lastUpdateDate: new Date(1),
      status: {
        state: 'ACTIVE',
      },
    };
  }) satisfies AssetModelSummary[];

  return {
    assetModelSummaries,
    nextToken,
  } satisfies Awaited<ReturnType<ListAssetModels>>;
}

export function createListAssetsPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const assetSummaries = new Array(pageSize).fill(null).map((_, index) => {
    const uniqueId = index + startIndex;

    return {
      arn: 'arn',
      id: `asset-${uniqueId}`,
      name: `Asset ${uniqueId}`,
      assetModelId: `asset-model-${uniqueId}`,
      description: `Description ${uniqueId}`,
      hierarchies: [],
      creationDate: new Date(0),
      lastUpdateDate: new Date(1),
      status: {
        state: 'ACTIVE',
      },
    };
  }) satisfies AssetSummary[];

  return {
    assetSummaries,
    nextToken,
  } satisfies Awaited<ReturnType<ListAssets>>;
}

export function createListAssetPropertiesPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const assetPropertySummaries = new Array(pageSize)
    .fill(null)
    .map((_, index) => {
      const uniqueId = index + startIndex;

      return {
        id: `asset-property-${uniqueId}`,
      };
    }) satisfies AssetPropertySummary[];

  return {
    assetPropertySummaries,
    nextToken,
  } satisfies Awaited<ReturnType<ListAssetProperties>>;
}
export function createListAssetModelPropertiesPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const assetModelPropertySummaries = new Array(pageSize)
    .fill(null)
    .map((_, index) => {
      const uniqueId = index + startIndex;

      return {
        id: `asset-property-${uniqueId}`,
        name: `Asset Property ${uniqueId}`,
        dataType: 'STRING',
        type: {
          measurement: {},
        },
      };
    }) satisfies AssetModelPropertySummary[];

  return {
    assetModelPropertySummaries,
    nextToken,
  } satisfies Awaited<ReturnType<ListAssetModelProperties>>;
}

export function createListTimeSeriesPage(
  pageSize: number,
  startIndex = 0,
  nextToken?: string
) {
  const timeSeriesSummaries = new Array(pageSize).fill(null).map((_, index) => {
    const uniqueId = index + startIndex;

    return {
      timeSeriesId: `time-series-${uniqueId}`,
      dataType: 'DOUBLE',
      timeSeriesArn: 'arn',
      timeSeriesCreationDate: new Date(0),
      timeSeriesLastUpdateDate: new Date(1),
    };
  }) satisfies TimeSeriesSummary[];

  return {
    TimeSeriesSummaries: timeSeriesSummaries,
    nextToken,
  } satisfies Awaited<ReturnType<ListTimeSeries>>;
}
