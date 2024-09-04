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

/**
 * Hook interface accepts any AWS SDK client type for IoT SiteWise
 */
export interface UseIoTSiteWiseClientOptions {
  iotSiteWiseClient?: IoTSiteWiseClient | IoTSiteWise;
}

/**
 *
 * @param iotSiteWiseClient is an AWS SDK client type for IoT SiteWise
 * @returns an IoTSiteWise type, promise pattern client
 *
 * @experimental Do not use in production.
 */
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
