import { useMemo } from 'react';
import { UseAlarmStateOptions } from './types';
import { useQueryMode } from './useQueryMode';
import { updateAlarmStatusForAlarmStateQueries } from './updateStatus';
import { updateAlarmStateData } from './updateAlarmStateValues';
import { useLatestAssetPropertyValues } from '../../../../queries';
import { useHistoricalAssetPropertyValues } from '../../../../queries/useHistoricalAssetPropertyValues/useHistoricalAssetPropertyValues';
import { createNonNullableList } from '../../../../utils/createNonNullableList';

export const useAlarmState = ({
  alarms,
  iotSiteWiseClient,
  viewport,
  fetchOnlyLatest,
  refreshRate,
}: UseAlarmStateOptions) => {
  const requests = useMemo(() => {
    return alarms.map(({ assetId, state }) => {
      return {
        assetId,
        propertyId: state?.property.id,
      };
    });
  }, [alarms]);

  const queryMode = useQueryMode({ fetchOnlyLatest, viewport });

  /**
   * Fetch only the latest value if there is no viewport present
   */
  const latestValueQueries = useLatestAssetPropertyValues({
    iotSiteWiseClient,
    enabled: queryMode === 'LATEST',
    requests,
    refreshRate,
  });

  /**
   * Fetch only the most recent asset property value before the viewport
   * end, useful for components that only need to show a subset
   * of points within the viewport.
   */
  const mostRecentBeforeEndValueQueries = useHistoricalAssetPropertyValues({
    enabled: queryMode === 'LATEST_IN_VIEWPORT',
    iotSiteWiseClient,
    requests,
    viewport,
    fetchMode: 'MOST_RECENT_BEFORE_END',
    maxNumberOfValues: 1,
    refreshRate,
  });

  /**
   * Fetch all asset property values within the viewport
   */
  const historicalQueriesInViewport = useHistoricalAssetPropertyValues({
    enabled: queryMode === 'LIVE' || queryMode === 'HISTORICAL',
    iotSiteWiseClient,
    requests,
    viewport,
    refreshRate: Infinity,
  });

  /**
   * If we are in a live viewport, we want to poll for the latest
   * asset property values in that viewport. To do this we use
   * the refreshRate for the latest value, and modify the
   * viewport to only be 2X the refreshRate.
   *
   * For example:
   * This means that if we refresh the alarms every 5s,
   * we fetch the last 10s of alarm state every 5s.
   */
  const latestQueriesViewport =
    refreshRate !== undefined ? { duration: refreshRate * 2 } : undefined;
  const latestQueriesInLiveViewport = useHistoricalAssetPropertyValues({
    enabled: queryMode === 'LIVE',
    iotSiteWiseClient,
    requests,
    viewport: latestQueriesViewport,
    refreshRate,
  });

  return useMemo(() => {
    return alarms.map((alarm, index) => {
      const latestValueQuery = latestValueQueries[index];
      const mostRecentBeforeEndValueQuery =
        mostRecentBeforeEndValueQueries[index];
      const historicalQueryInViewport = historicalQueriesInViewport[index];
      const latestQueryInLiveViewport = latestQueriesInLiveViewport[index];

      updateAlarmStatusForAlarmStateQueries(alarm, [
        latestValueQuery,
        mostRecentBeforeEndValueQuery,
        historicalQueryInViewport,
        latestQueryInLiveViewport,
      ]);

      const dataFromQueries = [
        ...createNonNullableList([latestValueQuery.data?.propertyValue]),
        ...(mostRecentBeforeEndValueQuery.data?.assetPropertyValueHistory ??
          []),
        ...(historicalQueryInViewport.data?.assetPropertyValueHistory ?? []),
        ...(latestQueryInLiveViewport.data?.assetPropertyValueHistory ?? []),
      ];

      updateAlarmStateData(alarm, { data: dataFromQueries, viewport });

      return alarm;
    });
  }, [
    alarms,
    viewport,
    latestQueriesInLiveViewport,
    latestValueQueries,
    historicalQueriesInViewport,
    mostRecentBeforeEndValueQueries,
  ]);
};
