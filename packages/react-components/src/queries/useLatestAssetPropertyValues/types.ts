import {
  GetAssetPropertyValue,
  BatchGetAssetPropertyValue,
  RequestParameters,
  RequestResponse,
} from '@iot-app-kit/core';
import { UseIoTSiteWiseClientOptions } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { UseQueryOptions } from '@tanstack/react-query';

export type QueryFnClient = {
  getAssetPropertyValue?: GetAssetPropertyValue;
  batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
};

export type LatestAssetPropertyValueRequest =
  RequestParameters<GetAssetPropertyValue>;
export type LatestAssetPropertyValueResponse =
  RequestResponse<GetAssetPropertyValue>;

export type QueryOptionsGlobal = Pick<UseQueryOptions, 'retry'>;

export type UseLatestAssetPropertyValuesOptions =
  UseIoTSiteWiseClientOptions & {
    requests?: LatestAssetPropertyValueRequest[];
    refreshRate?: number;
    enabled?: boolean;
  } & QueryOptionsGlobal;
