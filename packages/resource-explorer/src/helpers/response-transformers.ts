import type { ResponseTransformer } from '../types/requests';
import type {
  ListAssetModels,
  ListAssets,
  ListTimeSeries,
  RequestResponse,
} from '@iot-app-kit/core';
import type {
  AssetModelResource,
  AssetResource,
  TimeSeriesResource,
} from '../types/resources';

export const transformListAssetModelsResponse: ResponseTransformer<
  RequestResponse<ListAssetModels>,
  AssetModelResource
> = ({ assetModelSummaries = [] }) =>
  assetModelSummaries.map(({ id = '', name = '', description = '' }) => ({
    assetModelId: id,
    name,
    description,
  }));

export const transformListAssetsResponse: ResponseTransformer<
  RequestResponse<ListAssets>,
  AssetResource
> = ({ assetSummaries = [] }) =>
  assetSummaries.map(
    ({
      id = '',
      name = '',
      description = '',
      assetModelId = '',
      hierarchies,
    }) => ({
      assetId: id,
      name,
      description,
      assetModelId,
      hierarchies,
    })
  );

export const transformListTimeSeriesResponse: ResponseTransformer<
  RequestResponse<ListTimeSeries>,
  TimeSeriesResource
> = ({ TimeSeriesSummaries = [] }) =>
  TimeSeriesSummaries.map(
    ({
      timeSeriesId = '',
      dataType = 'DOUBLE',
      dataTypeSpec,
      alias,
      assetId,
      propertyId,
    }) => ({
      timeSeriesId,
      dataType,
      dataTypeSpec,
      alias,
      assetId,
      propertyId,
    })
  );
