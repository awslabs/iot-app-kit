import { createContext, useContext } from 'react';
import { useRefreshRate } from '~/customization/hooks/useRefreshRate';
import { alarmModelQueryToSiteWiseAssetQuery } from '~/customization/widgets/utils/alarmModelQueryToAlarmQuery';
import { assetModelQueryToSiteWiseAssetQuery } from '~/customization/widgets/utils/assetModelQueryToAssetQuery';

import type {
  DataStream,
  Primitive,
  TimeSeriesDataQuery,
} from '@iot-app-kit/core';
import type {
  AlarmDataQuery,
  SiteWiseDataStreamQuery,
  SiteWiseQuery,
  SiteWiseAlarmDataStreamQuery,
} from '@iot-app-kit/source-iotsitewise';
import type {
  DashboardIotSiteWiseQueries,
  IoTSiteWiseDataStreamQuery,
} from '~/types/queries';

const createTimeSeriesDataQuery = (
  iotSiteWiseQuery: SiteWiseQuery,
  { assets = [], properties = [], requestSettings }: SiteWiseDataStreamQuery
) => {
  if (assets.length === 0 && properties.length === 0) return [];
  return [
    iotSiteWiseQuery.timeSeriesData({ assets, properties, requestSettings }),
  ];
};

const createAlarmDataQuery = (
  iotSiteWiseQuery: SiteWiseQuery,
  { alarms = [], requestSettings }: SiteWiseAlarmDataStreamQuery
) => {
  if (alarms.length === 0) return [];
  return [iotSiteWiseQuery.alarmData({ alarms, requestSettings })];
};

export const QueryContext = createContext<Partial<DashboardIotSiteWiseQueries>>(
  {}
);

export const useQueries = ({
  assets = [],
  properties = [],
  assetModels = [],
  requestSettings = {},
  alarms = [],
  alarmModels = [],
}: IoTSiteWiseDataStreamQuery = {}): (
  | AlarmDataQuery
  | TimeSeriesDataQuery
)[] => {
  const { iotSiteWiseQuery } = useContext(QueryContext);
  const [refreshRate] = useRefreshRate();

  if (
    iotSiteWiseQuery == null ||
    (assets.length === 0 &&
      properties.length === 0 &&
      assetModels.length === 0 &&
      alarms.length === 0 &&
      alarmModels.length === 0)
  ) {
    return [];
  }

  const combinedAssets = assetModelQueryToSiteWiseAssetQuery({
    assetModels,
    assets,
  });
  const combinedAlarms = alarmModelQueryToSiteWiseAssetQuery({
    alarmModels,
    alarms,
  });

  const requestSettingsWithRefreshRate = {
    ...requestSettings,
    refreshRate,
  };

  return [
    ...createTimeSeriesDataQuery(iotSiteWiseQuery, {
      assets: combinedAssets,
      properties,
      requestSettings: requestSettingsWithRefreshRate,
    }),
    ...createAlarmDataQuery(iotSiteWiseQuery, {
      alarms: combinedAlarms,
      requestSettings: requestSettingsWithRefreshRate,
    }),
  ];
};

export const useFetchTimeSeriesData = () => {
  const { iotSiteWiseQuery } = useContext(QueryContext);
  if (!iotSiteWiseQuery)
    return () => new Promise(() => []) as Promise<DataStream<Primitive>[]>;

  return iotSiteWiseQuery.fetchTimeSeriesData;
};
