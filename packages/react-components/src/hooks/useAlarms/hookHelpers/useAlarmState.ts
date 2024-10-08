import { UseIoTSiteWiseClientOptions } from '../../requestFunctions/useIoTSiteWiseClient';
import { AlarmData, UseAlarmsHookSettings, UseAlarmsOptions } from '../types';
import { useQueryMode } from './useQueryMode';
import { combineStatusForQueries, isQueryDisabled } from '../utils/queryStatus';
import { useLatestAssetPropertyValues } from '../../../queries';
import { useHistoricalAssetPropertyValues } from '../../../queries/useHistoricalAssetPropertyValues/useHistoricalAssetPropertyValues';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { OnUpdateAlarmStateDataAction, useRequestSelector } from '../state';
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
    enabled: queryMode !== 'LATEST',
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
    refreshRate !== undefined && refreshRate !== Infinity
      ? { duration: refreshRate * 2 }
      : undefined;
  const latestQueriesInLiveViewport = useHistoricalAssetPropertyValues({
    enabled: queryMode === 'LIVE',
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
        const historicalQueryInViewport = historicalQueriesInViewport[index];
        const latestQueryInLiveViewport = latestQueriesInLiveViewport[index];

        const dataFromQueries = [
          ...createNonNullableList([latestValueQuery.data?.propertyValue]),
          ...(mostRecentBeforeEndValueQuery.data?.assetPropertyValueHistory ??
            []),
          ...(historicalQueryInViewport.data?.assetPropertyValueHistory ?? []),
          ...(latestQueryInLiveViewport.data?.assetPropertyValueHistory ?? []),
        ];

        const statusFromQueries = [
          latestValueQuery,
          mostRecentBeforeEndValueQuery,
          historicalQueryInViewport,
          latestQueryInLiveViewport,
        ].filter((query) => !isQueryDisabled(query));

        const status = combineStatusForQueries(statusFromQueries);

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
  ]);
};
