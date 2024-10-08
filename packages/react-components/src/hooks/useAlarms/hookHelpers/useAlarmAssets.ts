import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import type { AlarmRequest } from '../types';
import { useDescribeAssetModels, useDescribeAssets } from '../../../queries';
import { getStatusForQuery } from '../utils/queryStatus';
import { isAssetModelRequest, isAssetRequest } from './predicates';
import type { QueryOptionsGlobal } from '../../../queries/common/types';
import { OnSummarizeAlarmAction, useRequestSelector } from '../state';
import { useReactQueryEffect } from './useReactQueryEffect';

export type UseAlarmAssetsOptions = {
  iotSiteWiseClient?: IoTSiteWiseClient;
  requests?: AlarmRequest[];
  onSummarizeAlarms: OnSummarizeAlarmAction;
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
  onSummarizeAlarms,
}: UseAlarmAssetsOptions) {
  // Fetch an asset model for request with an assetModelId
  const assetModelRequests = useRequestSelector(requests, (allRequests) =>
    allRequests.filter(isAssetModelRequest)
  );
  const assetModelQueries = useDescribeAssetModels({
    iotSiteWiseClient,
    requests: assetModelRequests,
    retry,
  });

  // Fetch an asset for each request with an assetId
  const assetRequests = useRequestSelector(requests, (allRequests) =>
    allRequests.filter(isAssetRequest)
  );
  const assetQueries = useDescribeAssets({
    iotSiteWiseClient,
    requests: assetRequests,
    retry,
  });

  useReactQueryEffect(() => {
    onSummarizeAlarms({
      assetModelSummaries: assetModelQueries.map((query, index) => ({
        data: query.data,
        request: assetModelRequests[index],
        status: getStatusForQuery(query),
      })),
      assetSummaries: assetQueries.map((query, index) => ({
        data: query.data,
        request: assetRequests[index],
        status: getStatusForQuery(query),
      })),
    });
  }, [assetModelQueries, assetQueries]);
}
