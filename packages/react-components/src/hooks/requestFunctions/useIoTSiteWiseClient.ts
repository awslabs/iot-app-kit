import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useMemo } from 'react';
import {
  createBatchGetAssetPropertyValue,
  createBatchGetAssetPropertyValueHistory,
  createDescribeAsset,
  createDescribeAssetModel,
  createExecuteQuery,
  createGetAssetPropertyValue,
  createGetAssetPropertyValueHistory,
  createListAssetModelProperties,
  createListAssetModels,
  createListAssetProperties,
  createListAssets,
  createListAssociatedAssets,
  createListTimeSeries,
} from './data/iotsitewise';

export interface UseIoTSiteWiseClientOptions {
  iotSiteWiseClient?: IoTSiteWiseClient | IoTSiteWise;
}

export function useIoTSiteWiseClient({
  iotSiteWiseClient,
}: UseIoTSiteWiseClientOptions): IoTSiteWise {
  const iotSiteWise = useMemo(() => {
    if (iotSiteWiseClient instanceof IoTSiteWiseClient) {
      return {
        getAssetPropertyValue: createGetAssetPropertyValue(iotSiteWiseClient),
        batchGetAssetPropertyValue:
          createBatchGetAssetPropertyValue(iotSiteWiseClient),
        getAssetPropertyValueHistory:
          createGetAssetPropertyValueHistory(iotSiteWiseClient),
        batchGetAssetPropertyValueHistory:
          createBatchGetAssetPropertyValueHistory(iotSiteWiseClient),
        executeQuery: createExecuteQuery(iotSiteWiseClient),
        listAssetModels: createListAssetModels(iotSiteWiseClient),
        listAssetModelProperties:
          createListAssetModelProperties(iotSiteWiseClient),
        listAssets: createListAssets(iotSiteWiseClient),
        listAssociatedAssets: createListAssociatedAssets(iotSiteWiseClient),
        listTimeSeries: createListTimeSeries(iotSiteWiseClient),
        listAssetProperties: createListAssetProperties(iotSiteWiseClient),
        describeAsset: createDescribeAsset(iotSiteWiseClient),
        describeAssetModel: createDescribeAssetModel(iotSiteWiseClient),
      } as IoTSiteWise;
    }

    return iotSiteWiseClient;
  }, [iotSiteWiseClient]);

  return iotSiteWise as IoTSiteWise;
}
