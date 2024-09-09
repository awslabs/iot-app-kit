import {
  GetAssetPropertyValue,
  BatchGetAssetPropertyValue,
  RequestParameters,
  RequestResponse,
} from '@iot-app-kit/core';
import { UseIoTSiteWiseClientOptions } from '../../hooks/requestFunctions/useIoTSiteWiseClient';

export type QueryFnClient = {
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
  };
