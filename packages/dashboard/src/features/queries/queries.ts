import type { StyleSettingsMap } from '@iot-app-kit/core';
import type {
  SiteWiseAlarmAssetModelQuery,
  SiteWiseAlarmQuery,
  SiteWiseAssetModelQuery,
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
  SiteWiseQuery,
} from '@iot-app-kit/source-iotsitewise';

export interface DashboardIotSiteWiseQueries {
  iotSiteWiseQuery: SiteWiseQuery;
}

export type IoTSiteWiseDataStreamQuery = Partial<
  SiteWiseAssetQuery &
    SiteWisePropertyAliasQuery &
    SiteWiseAssetModelQuery &
    SiteWiseAlarmQuery &
    SiteWiseAlarmAssetModelQuery
>;

export type QueryConfig<S, T> = {
  source: S;
  query: T;
};

export type SiteWiseQueryConfig = QueryConfig<
  'iotsitewise',
  | ((Partial<SiteWiseAssetQuery> &
      Partial<SiteWisePropertyAliasQuery> &
      Partial<SiteWiseAssetModelQuery>) &
      Partial<SiteWiseAlarmQuery> &
      Partial<SiteWiseAlarmAssetModelQuery>)
  | undefined
>;

export type QueryProperties = {
  styleSettings?: StyleSettingsMap;
  queryConfig?: SiteWiseQueryConfig;
};
