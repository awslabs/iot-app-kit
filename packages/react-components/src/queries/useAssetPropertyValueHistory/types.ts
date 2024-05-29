import { Viewport } from '@iot-app-kit/core';
import {
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse,
} from '@aws-sdk/client-iotsitewise';
import { RequestFunction, RequestParameters } from '../request-fn';

// export type AssetPropertyRequestQuery = {
//   assetId: string;
//   propertyId: string;
//   viewport: Viewport;
// };

// export type TimeSeriesDataRequestQuery = Partial<AssetPropertyRequestQuery>;

// export type RequiredTimeSeriesDataRequestQuery = Required<AssetPropertyRequestQuery>;

// export type RequestQueryViewport = RequiredTimeSeriesDataRequestQuery['viewport'] & { startOffset?: number, refreshRate?: number; };
// export type RequestQuery = Pick<RequiredTimeSeriesDataRequestQuery, 'assetId' | 'propertyId'> & { viewport: RequestQueryViewport };

export type GetAssetPropertyValueHistoryRequestFunction = RequestFunction<
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse
>;

type GetAssetPropertyValueHistoryRequestParameters =
  RequestParameters<GetAssetPropertyValueHistoryRequestFunction>;
export type TimeSeriesRequestViewport = Viewport & {
  startOffset?: number;
  refreshRate?: number;
};

export type GetAssetPropertyValueHistoryDataRequest = Omit<
  GetAssetPropertyValueHistoryRequestParameters,
  'startDate' | 'endDate'
> & { viewport: TimeSeriesRequestViewport };
