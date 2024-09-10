import {
  RequestParameters,
  RequestResponse,
  GetAssetPropertyValueHistory,
  BatchGetAssetPropertyValueHistory,
  Viewport,
} from '@iot-app-kit/core';
import { UseIoTSiteWiseClientOptions } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { UseQueryOptions } from '@tanstack/react-query';

export type QueryFnClient = {
  getAssetPropertyValueHistory?: GetAssetPropertyValueHistory;
  batchGetAssetPropertyValueHistory?: BatchGetAssetPropertyValueHistory;
};

export type HistoricalAssetPropertyValueRequest = Omit<
  RequestParameters<GetAssetPropertyValueHistory>,
  'startDate' | 'endDate'
> & { viewport?: Viewport };

export type HistoricalAssetPropertyValueResponse =
  RequestResponse<GetAssetPropertyValueHistory>;

export type QueryOptionsGlobal = Pick<UseQueryOptions, 'retry'>;

export type UseHistoricalAssetPropertyValuesOptions =
  UseIoTSiteWiseClientOptions & {
    requests?: HistoricalAssetPropertyValueRequest[];
    refreshRate?: number;
    enabled?: boolean;
    viewport?: Viewport;
  } & QueryOptionsGlobal;
