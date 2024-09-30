import { useMemo } from 'react';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { AlarmDataInternal, AlarmRequest } from '../types';
import { useDescribeAssetModels, useDescribeAssets } from '../../../queries';
import {
  createFromAssetModelResponse,
  createFromAssetResponse,
} from '../utils/createAlarmData';
import { getStatusForQuery } from '../utils/queryStatus';
import { isAssetModelRequest, isAssetRequest } from './predicates';
import type { QueryOptionsGlobal } from '../../../queries/common/types';

export type UseAlarmAssetsOptions = {
  iotSiteWiseClient?: IoTSiteWiseClient;
  requests?: AlarmRequest[];
} & QueryOptionsGlobal;

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
  retry,
}: UseAlarmAssetsOptions): AlarmDataInternal[] {
  // Fetch an asset model for request with an assetModelId
  const assetModelRequests = requests.filter(isAssetModelRequest);
  const assetModelQueries = useDescribeAssetModels({
    iotSiteWiseClient,
    requests: assetModelRequests,
    retry,
  });

  // Fetch an asset for each request with an assetId
  const assetRequests = requests.filter(isAssetRequest);
  const assetQueries = useDescribeAssets({
    iotSiteWiseClient,
    requests: assetRequests,
    retry,
  });

  // Initialize AlarmData for all alarms from assetModels
  const assetModelAlarms = useMemo(
    () =>
      assetModelRequests
        .map((request, index) => {
          const status = getStatusForQuery(assetModelQueries[index]);
          return createFromAssetModelResponse({
            request,
            status,
            assetModelResponse: assetModelQueries[index].data,
          });
        })
        .flat(),
    [assetModelRequests, assetModelQueries]
  );

  // Initialize AlarmData for all alarms from assets
  const assetAlarms = useMemo(
    () =>
      assetRequests
        .map((request, index) => {
          const status = getStatusForQuery(assetQueries[index]);
          return createFromAssetResponse({
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
