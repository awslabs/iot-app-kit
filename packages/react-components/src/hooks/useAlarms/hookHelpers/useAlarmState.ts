import { type UseIoTSiteWiseClientOptions } from '../../requestFunctions/useIoTSiteWiseClient';
import {
  type AlarmData,
  type UseAlarmsHookSettings,
  type UseAlarmsOptions,
} from '../types';
import { useQueryMode } from './useQueryMode';
import { combineStatusForQueries } from '../utils/queryStatus';
import { useLatestAssetPropertyValues } from '../../../queries';
import { useHistoricalAssetPropertyValues } from '../../../queries/useHistoricalAssetPropertyValues/useHistoricalAssetPropertyValues';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import {
  type OnUpdateAlarmStateDataAction,
  useRequestSelector,
} from '../state';
import { useReactQueryEffect } from './useReactQueryEffect';

export type UseAlarmStateOptions = Pick<
  UseIoTSiteWiseClientOptions,
  'iotSiteWiseClient'
> &
  Pick<UseAlarmsHookSettings, 'fetchOnlyLatest' | 'refreshRate'> &
  Pick<UseAlarmsOptions, 'viewport'> & {
    requests: Pick<AlarmData, 'assetId' | 'state'>[];
  } & {
    onUpdateAlarmStateData: OnUpdateAlarmStateDataAction;
  };

export const useAlarmState = ({
  requests: alarmStateRequests,
  onUpdateAlarmStateData,
  iotSiteWiseClient,
  viewport,
  fetchOnlyLatest,
  refreshRate,
}: UseAlarmStateOptions) => {
  const requests = useRequestSelector(alarmStateRequests, (alarmRequests) =>
    alarmRequests.map(({ assetId, state }) => ({
      assetId,
      propertyId: state?.property.id,
    }))
  );

  const queryMode = useQueryMode({ fetchOnlyLatest, viewport });

  /**
   * Fetch only the latest value if there is no viewport present
   */
  const latestValueQueriesEnabled = queryMode === 'LATEST';
  const latestValueQueries = useLatestAssetPropertyValues({
    iotSiteWiseClient,
    enabled: latestValueQueriesEnabled,
    requests,
    refreshRate,
  });

  /**
   * Fetch only the most recent asset property value before the viewport
   * end, useful for components that only need to show a subset
   * of points within the viewport.
   */
  const mostRecentBeforeEndValueQueriesEnabled = queryMode !== 'LATEST';
  const mostRecentBeforeEndValueQueries = useHistoricalAssetPropertyValues({
    enabled: mostRecentBeforeEndValueQueriesEnabled,
    iotSiteWiseClient,
    requests,
    viewport,
    fetchMode: 'MOST_RECENT_BEFORE_END',
    maxNumberOfValues: 1,
    refreshRate,
  });

  /**
   * Fetch only the most recent asset property value before the viewport
   * start, useful for components that have data in the viewport but
   * need to fill in data from before the start of the viewport.
   */
  const mostRecentBeforeStartValueQueriesEnabled = queryMode !== 'LATEST';
  const mostRecentBeforeStartValueQueries = useHistoricalAssetPropertyValues({
    enabled: mostRecentBeforeStartValueQueriesEnabled,
    iotSiteWiseClient,
    requests,
    viewport,
    fetchMode: 'MOST_RECENT_BEFORE_START',
    maxNumberOfValues: 1,
    refreshRate: Infinity,
  });

  /**
   * Fetch all asset property values within the viewport
   */
  const historicalQueriesInViewportEnabled =
    queryMode === 'LIVE' || queryMode === 'HISTORICAL';
  const historicalQueriesInViewport = useHistoricalAssetPropertyValues({
    enabled: historicalQueriesInViewportEnabled,
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
  const latestQueriesInLiveViewportEnabled = queryMode === 'LIVE';
  const latestQueriesViewport =
    refreshRate !== undefined && refreshRate !== Infinity
      ? { duration: refreshRate * 2 }
      : undefined;
  const latestQueriesInLiveViewport = useHistoricalAssetPropertyValues({
    enabled: latestQueriesInLiveViewportEnabled,
    iotSiteWiseClient,
    requests,
    viewport: latestQueriesViewport,
    refreshRate,
  });

  useReactQueryEffect(() => {
    onUpdateAlarmStateData({
      viewport,
      assetPropertyValueSummaries: requests.map((request, index) => {
        const latestValueQuery = latestValueQueries[index];
        const mostRecentBeforeEndValueQuery =
          mostRecentBeforeEndValueQueries[index];
        const mostRecentBeforeStartValueQuery =
          mostRecentBeforeStartValueQueries[index];
        const historicalQueryInViewport = historicalQueriesInViewport[index];
        const latestQueryInLiveViewport = latestQueriesInLiveViewport[index];

        /**
         * derive status and data from only those queries
         * who are enabled. It is possible that disabled
         * queries return data if they were enabled in other
         * useAlarms hooks for the same request.
         * This could lead to a scenario where we return
         * different data than requested and with a status that
         * is not accurate.
         */
        const queries = [
          latestValueQueriesEnabled ? latestValueQuery : undefined,
          mostRecentBeforeEndValueQueriesEnabled
            ? mostRecentBeforeEndValueQuery
            : undefined,
          mostRecentBeforeStartValueQueriesEnabled
            ? mostRecentBeforeStartValueQuery
            : undefined,
          historicalQueriesInViewportEnabled
            ? historicalQueryInViewport
            : undefined,
          latestQueriesInLiveViewportEnabled
            ? latestQueryInLiveViewport
            : undefined,
        ] as const;

        const dataFromQueries = [
          ...createNonNullableList([queries[0]?.data?.propertyValue]),
          ...(queries[1]?.data?.assetPropertyValueHistory ?? []),
          ...(queries[2]?.data?.assetPropertyValueHistory ?? []),
          ...(queries[3]?.data?.assetPropertyValueHistory ?? []),
          ...(queries[4]?.data?.assetPropertyValueHistory ?? []),
        ];

        const status = combineStatusForQueries(
          createNonNullableList([...queries])
        );

        return {
          request,
          data: dataFromQueries,
          status,
        };
      }),
    });
  }, [
    latestQueriesInLiveViewport,
    latestValueQueries,
    historicalQueriesInViewport,
    mostRecentBeforeEndValueQueries,
    mostRecentBeforeStartValueQueries,
  ]);
};
