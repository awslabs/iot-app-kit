import { useMemo } from 'react';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { AlarmData, AlarmRequest } from '../types';
import { useDescribeAssetModels, useDescribeAssets } from '../../../queries';
import {
  buildFromAssetModelResponse,
  buildFromAssetResponse,
} from '../utils/alarmDataUtils';
import { getStatusForQuery } from '../utils/queryUtils';
import { isAssetModelRequest, isAssetRequest } from './predicates';

export interface UseAlarmAssetsOptions {
  iotSiteWiseClient?: IoTSiteWiseClient;
  requests?: AlarmRequest[];
}

/**
 * useAlarmAssets is a hook used to describe the asset or assetModel
 * in an AlarmRequest and find the associated SiteWise alarms
 *
 * @param iotSiteWiseClient is an AWS SDK IoT SiteWise client
 * @param requests is a list of AlarmRequests
 * @returns a list of AlarmData for all alarms in all requests
 */
export function useAlarmAssets({
  iotSiteWiseClient,
  requests = [],
}: UseAlarmAssetsOptions): AlarmData[] {
  // Fetch an asset model for request with an assetModelId
  const assetModelRequests = requests.filter(isAssetModelRequest);
  const assetModelQueries = useDescribeAssetModels({
    iotSiteWiseClient,
    requests: assetModelRequests,
  });

  // Fetch an asset for each request with an assetId
  const assetRequests = requests.filter(isAssetRequest);
  const assetQueries = useDescribeAssets({
    iotSiteWiseClient,
    requests: assetRequests,
  });

  // Build AlarmData for all alarms from assetModels
  const assetModelAlarms = useMemo(
    () =>
      assetModelRequests
        .map((request, index) => {
          const status = getStatusForQuery(assetModelQueries[index]);
          return buildFromAssetModelResponse({
            request,
            status,
            assetModelResponse: assetModelQueries[index].data,
          });
        })
        .flat(),
    [assetModelRequests, assetModelQueries]
  );

  // Build AlarmData for all alarms from assets
  const assetAlarms = useMemo(
    () =>
      assetRequests
        .map((request, index) => {
          const status = getStatusForQuery(assetQueries[index]);
          return buildFromAssetResponse({
            request,
            status,
            assetResponse: assetQueries[index].data,
          });
        })
        .flat(),
    [assetRequests, assetQueries]
  );

  // We will not maintain the order of alarms based on the requests
  return useMemo(
    () => [...assetModelAlarms, ...assetAlarms],
    [assetModelAlarms, assetAlarms]
  );
}
