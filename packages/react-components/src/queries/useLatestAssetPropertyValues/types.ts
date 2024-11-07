import {
  type GetAssetPropertyValue,
  type BatchGetAssetPropertyValue,
  type RequestParameters,
  type RequestResponse,
} from '@iot-app-kit/core';
import { type UseIoTSiteWiseClientOptions } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { type QueryOptionsGlobal } from '../common/types';

export type LatestValueQueryFnClient = {
  getAssetPropertyValue?: GetAssetPropertyValue;
  batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
};

export type LatestAssetPropertyValueRequest =
  RequestParameters<GetAssetPropertyValue>;
export type LatestAssetPropertyValueResponse =
  RequestResponse<GetAssetPropertyValue>;

export type UseLatestAssetPropertyValuesOptions =
  UseIoTSiteWiseClientOptions & {
    requests?: LatestAssetPropertyValueRequest[];
    refreshRate?: number;
    enabled?: boolean;
  } & QueryOptionsGlobal;
