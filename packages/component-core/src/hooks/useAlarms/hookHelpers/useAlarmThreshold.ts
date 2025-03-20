import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { createNonNullableList, type Viewport } from '@iot-app-kit/core';
import { type AlarmData } from '../types';
import { extractAssetPropertyId } from '../utils/parseAlarmModels';
import { useQueryMode } from './useQueryMode';
import {
  useHistoricalAssetPropertyValues,
  useLatestAssetPropertyValues,
} from '../../../queries';
import { combineStatusForQueries } from '../utils/queryStatus';
import {
  type OnUpdateAlarmThresholdDataAction,
  useRequestSelector,
} from '../state';
import { useReactQueryEffect } from './useReactQueryEffect';

export interface UseAlarmThresholdOptions {
  iotSiteWiseClient?: IoTSiteWiseClient;
  requests: Pick<AlarmData, 'assetId' | 'models'>[];
  viewport?: Viewport;
  fetchThresholds?: boolean;
  fetchOnlyLatest?: boolean;
  refreshRate?: number;
  onUpdateAlarmThresholdData: OnUpdateAlarmThresholdDataAction;
}

/**
 * useAlarmThreshold is a hook used to fetch the values
 * for a SiteWise alarm's threshold.
 *
 * A threshold is defined on an IoT Events alarm model.
 * The value can be statically defined on the alarm model,
 * or it is modeled in IoT SiteWise as an asset property.
 *
 * @param alarms is a list of AlarmData
 * @param iotSiteWiseClient is an AWS SDK IoT SiteWise client
 * @param viewport is a time range to fetch data
 * @param enabled will manually disable the hook
 * @param fetchOnlyLatest is a flag to only fetch the latest data
 * @param refreshRate is the time to refresh threshold data in milliseconds
 * before the end of the viewport
 * @returns a list of AlarmData with the threshold values injected
 * into the associated threshold field
 */
export const useAlarmThreshold = ({
  requests: thresholdRequests,
  iotSiteWiseClient,
  viewport,
  fetchThresholds: enabled,
  fetchOnlyLatest,
  refreshRate,
  onUpdateAlarmThresholdData,
}: UseAlarmThresholdOptions) => {
  const requests = useRequestSelector(thresholdRequests, (alarmRequests) =>
    alarmRequests.map(({ assetId, models = [] }) => {
      // Find the threshold's source asset propertyId if it is modeled in SiteWise
      const thresholdPropertyIds = createNonNullableList(
        models.map((model) =>
          extractAssetPropertyId(model.alarmRule?.simpleRule?.threshold)
        )
      );
      return {
        assetId,
        propertyId: thresholdPropertyIds.at(0),
      };
    })
  );

  const queryMode = useQueryMode({ fetchOnlyLatest, viewport });

  const latestValueQueriesEnabled = enabled && queryMode === 'LATEST';
  const mostRecentBeforeEndValueQueriesEnabled =
    enabled && queryMode !== 'LATEST';
  const historicalQueriesInViewportEnabled =
    enabled && (queryMode === 'LIVE' || queryMode === 'HISTORICAL');

  // Fetch only the latest value if there is no viewport present
  const latestValueQueries = useLatestAssetPropertyValues({
    enabled: latestValueQueriesEnabled,
    iotSiteWiseClient,
    requests,
    refreshRate,
  });

  // Fetch only the most recent asset property value before the viewport end.
  const mostRecentBeforeEndValueQueries = useHistoricalAssetPropertyValues({
    enabled: mostRecentBeforeEndValueQueriesEnabled,
    iotSiteWiseClient,
    requests,
    viewport,
    fetchMode: 'MOST_RECENT_BEFORE_END',
    maxNumberOfValues: 1,
    refreshRate,
  });

  // Fetch all asset property values within the viewport
  const historicalQueriesInViewport = useHistoricalAssetPropertyValues({
    enabled: historicalQueriesInViewportEnabled,
    iotSiteWiseClient,
    requests,
    viewport,
    refreshRate,
  });

  useReactQueryEffect(() => {
    if (!enabled) return;

    onUpdateAlarmThresholdData({
      viewport,
      assetPropertyValueSummaries: requests.map((request, index) => {
        const latestValueQuery = latestValueQueries[index];
        const mostRecentBeforeEndValueQuery =
          mostRecentBeforeEndValueQueries[index];
        const historicalQueryInViewport = historicalQueriesInViewport[index];

        // derive status and data from only those queries
        // who are enabled. It is possible that disabled
        // queries return data if they were enabled in other
        // useAlarms hooks for the same request.
        // This could lead to a scenario where we return
        // different data than requested and with a status that
        // is not accurate.
        const queries = [
          latestValueQueriesEnabled ? latestValueQuery : undefined,
          mostRecentBeforeEndValueQueriesEnabled
            ? mostRecentBeforeEndValueQuery
            : undefined,
          historicalQueriesInViewportEnabled
            ? historicalQueryInViewport
            : undefined,
        ] as const;

        const status = combineStatusForQueries(
          createNonNullableList([...queries])
        );

        return {
          request,
          data: [
            ...createNonNullableList([queries[0]?.data?.propertyValue]),
            ...(queries[1]?.data?.assetPropertyValueHistory ?? []),
            ...(queries[2]?.data?.assetPropertyValueHistory ?? []),
          ],
          status,
        };
      }),
    });
  }, [
    latestValueQueries,
    mostRecentBeforeEndValueQueries,
    historicalQueriesInViewport,
  ]);
};
