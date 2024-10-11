import { useMemo } from 'react';
import { ComponentQuery } from '../../common/chartTypes';
import { getAlarmQueries, getTimeSeriesQueries } from '../../utils/queries';
import {
  AlarmCompositeModelRequest,
  AlarmData,
  AlarmInputPropertyRequest,
  UseAlarmsOptions,
  useAlarms,
} from '../useAlarms';
import { createNonNullableList } from '../../utils/createNonNullableList';

/**
 *
 * Utility hook that adapts queries from source-iotsitewise
 * into useAlarms hook request objects and settings
 *
 * This hook is meant to be used within react-components
 * charts and widgets to make it easy to call useAlarms
 * without having to filter different query types
 * and map clients / settings into the correct
 * options object.
 */
export const useAlarmsFromQueries = <T = AlarmData>({
  queries,
  settings,
  inputPropertyTimeSeriesDataSettings,
  viewport,
  transform,
}: { queries: ComponentQuery[] } & Pick<
  UseAlarmsOptions<T>,
  'settings' | 'viewport' | 'inputPropertyTimeSeriesDataSettings'
> &
  Required<Pick<UseAlarmsOptions<T>, 'transform'>>) => {
  const requests = useMemo(() => {
    const alarmQueries = getAlarmQueries(queries);
    const timeSeriesDataQueries = getTimeSeriesQueries(queries);

    const alarmRequests: AlarmCompositeModelRequest[] = alarmQueries.flatMap(
      ({ query: { alarms = [] } }) =>
        alarms.flatMap(({ assetId, alarmComponents }) =>
          alarmComponents.map(({ assetCompositeModelId }) => ({
            assetId,
            assetCompositeModelId,
          }))
        )
    );

    const timeSeriesRequests: AlarmInputPropertyRequest[] =
      timeSeriesDataQueries.flatMap(({ query: { assets = [] } = {} }) =>
        assets.flatMap(({ assetId, properties }) =>
          properties
            .filter(({ alarms }) => !!alarms)
            .map(({ propertyId }) => ({
              assetId,
              inputPropertyId: propertyId,
            }))
        )
      );

    return [...alarmRequests, ...timeSeriesRequests];
  }, [queries]);

  const clients = useMemo(() => {
    const firstAlarmQuery = getAlarmQueries(queries).at(0);

    return {
      timeSeriesData: firstAlarmQuery?.timeSeriesData,
      iotEventsClient: firstAlarmQuery?.iotEventsClient,
      iotSiteWiseClient: firstAlarmQuery?.iotSiteWiseClient,
    };
  }, [queries]);

  const requestSettings = useMemo(() => {
    const requestSettingsFromQueries = createNonNullableList(
      getAlarmQueries(queries).map(
        ({ query: { requestSettings } }) => requestSettings
      )
    );

    const refreshRate = requestSettingsFromQueries
      .filter(({ refreshRate }) => refreshRate != null)
      .at(0)?.refreshRate;
    const aggregationType = requestSettingsFromQueries
      .filter(({ aggregationType }) => aggregationType != null)
      .at(0)?.aggregationType;
    const resolution = requestSettingsFromQueries
      .filter(({ resolution }) => resolution != null)
      .at(0)?.resolution;

    return {
      refreshRate,
      aggregationType,
      resolution,
    };
  }, [queries]);

  const alarms = useAlarms<T>({
    requests,
    transform,
    viewport,
    ...clients,
    settings: {
      ...settings,
      refreshRate: requestSettings.refreshRate,
    },
    inputPropertyTimeSeriesDataSettings: {
      ...inputPropertyTimeSeriesDataSettings,
      aggregationType: requestSettings.aggregationType,
      resolution: requestSettings.resolution,
    },
  });

  return alarms;
};
