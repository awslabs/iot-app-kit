import { useMemo } from 'react';
import {
  AssetPropertyValue,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { Viewport } from '@iot-app-kit/core';
import { AlarmData } from '../types';
import {
  extractAssetPropertyId,
  getStaticThresholdAsAssetPropertyValue,
} from '../utils/parseAlarmModels';
import { useQueryMode } from './useQueryMode';
import {
  useHistoricalAssetPropertyValues,
  useLatestAssetPropertyValues,
} from '../../../queries';
import { updateAlarmStatusForQueries } from '../utils/queryStatus';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { updateAlarmThresholdData } from '../utils/updateAlarmValues';

export interface UseAlarmThresholdOptions {
  iotSiteWiseClient?: IoTSiteWiseClient;
  alarms?: AlarmData[];
  viewport?: Viewport;
  enabled?: boolean;
  fetchOnlyLatest?: boolean;
  refreshRate?: number;
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
  alarms,
  iotSiteWiseClient,
  viewport,
  enabled,
  fetchOnlyLatest,
  refreshRate,
}: UseAlarmThresholdOptions) => {
  const requests = useMemo(() => {
    return alarms?.map(({ assetId, models }) => {
      // Find the threshold's source asset propertyId if it is modeled in SiteWise
      let thresholdPropertyId: string | undefined;
      if (models && models.length > 0) {
        const threshold = models[0].alarmRule?.simpleRule?.threshold;
        thresholdPropertyId = extractAssetPropertyId(threshold);
      }
      return {
        assetId,
        propertyId: thresholdPropertyId,
      };
    });
  }, [alarms]);

  const queryMode = useQueryMode({ fetchOnlyLatest, viewport });

  /**
   * Fetch only the latest value if there is no viewport present
   */
  const latestValueQueries = useLatestAssetPropertyValues({
    enabled: enabled && queryMode === 'LATEST',
    iotSiteWiseClient,
    requests,
    refreshRate,
  });

  /**
   * Fetch only the most recent asset property value before the viewport end.
   * Useful if there is no threshold data within the viewport.
   */
  const mostRecentBeforeEndValueQueries = useHistoricalAssetPropertyValues({
    enabled: enabled && queryMode !== 'LATEST',
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
    enabled: enabled && (queryMode === 'LIVE' || queryMode === 'HISTORICAL'),
    iotSiteWiseClient,
    requests,
    viewport,
    refreshRate,
  });

  return useMemo(() => {
    return (
      alarms?.map((alarm, index) => {
        // Short circuit if thresholds not enabled
        if (!enabled) return alarm;

        const latestValueQuery = latestValueQueries[index];
        const mostRecentBeforeEndValueQuery =
          mostRecentBeforeEndValueQueries[index];
        const historicalQueryInViewport = historicalQueriesInViewport[index];

        /**
         * Find the threshold static value if it is defined on the alarm model.
         *
         * We only consider a single alarm model for now.
         */
        const staticThresholdValue =
          alarm.models && alarm.models.length > 0
            ? getStaticThresholdAsAssetPropertyValue(alarm.models[0])
            : undefined;

        const staticThresholdData = staticThresholdValue
          ? [staticThresholdValue]
          : [];
        let thresholdData: AssetPropertyValue[] = [];

        // If there is no static value then the query may have data for the threshold
        if (!staticThresholdData.length) {
          updateAlarmStatusForQueries(alarm, [
            latestValueQuery,
            mostRecentBeforeEndValueQuery,
            historicalQueryInViewport,
          ]);

          thresholdData = [
            ...createNonNullableList([latestValueQuery.data?.propertyValue]),
            ...(mostRecentBeforeEndValueQuery.data?.assetPropertyValueHistory ??
              []),
            ...(historicalQueryInViewport.data?.assetPropertyValueHistory ??
              []),
          ];
        }

        updateAlarmThresholdData(alarm, {
          data: thresholdData,
          viewport,
          staticData: staticThresholdData,
        });

        return alarm;
      }) ?? []
    );
  }, [
    enabled,
    alarms,
    viewport,
    latestValueQueries,
    historicalQueriesInViewport,
    mostRecentBeforeEndValueQueries,
  ]);
};
