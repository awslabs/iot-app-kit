import type {
  AwsCredentialIdentity,
  Provider as AWSCredentialsProvider,
  Provider,
} from '@aws-sdk/types';
import {
  type DataStream,
  TimeSeriesDataModule,
  type TimeSeriesDataQuery as TimeSeriesDataQueryCore,
  type TimeSeriesDataRequest,
  type TimeSeriesDataRequestSettings,
  type Viewport,
} from '@iot-app-kit/core';
import { type IoTEventsClient } from '@aws-sdk/client-iot-events';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { getIotEventsClient, getSiteWiseClient } from '@iot-app-kit/core-util';
import { SiteWiseTimeSeriesDataProvider } from './time-series-data/provider';
import {
  type SiteWiseAssetDataSource,
  SiteWiseAssetModule,
} from './asset-modules';
import { SiteWiseComponentSession } from './component-session';
import { createSiteWiseAssetDataSource } from './asset-modules/asset-data-source';
import { createDataSource } from './time-series-data';
import { SiteWiseAlarmModule } from './alarms/iotevents';
import type {
  SiteWiseAlarmDataStreamQuery,
  SiteWiseAnomalyDataStreamQuery,
  SiteWiseDataSourceSettings,
  SiteWiseDataStreamQuery,
} from './time-series-data/types';
import { fetchTimeSeriesData } from './time-series-data/fetchTimeSeriesData';

const SOURCE = 'iotsitewise';

export interface TimeSeriesDataQuery extends TimeSeriesDataQueryCore {
  query?: SiteWiseDataStreamQuery;
}

export interface AnomalyDataQuery {
  query: SiteWiseAnomalyDataStreamQuery;
  iotSiteWiseClient: IoTSiteWiseClient;
}

export interface AlarmDataQuery {
  query: SiteWiseAlarmDataStreamQuery;
  iotSiteWiseClient: IoTSiteWiseClient;
  iotEventsClient: IoTEventsClient;
  timeSeriesData: (query: SiteWiseDataStreamQuery) => TimeSeriesDataQuery;
}

export interface SiteWiseDataSourceInitInputs {
  iotSiteWiseClient?: IoTSiteWiseClient;
  iotEventsClient?: IoTEventsClient;
  /** {@link https://www.npmjs.com/package/@aws-sdk/credential-providers | Credential Providers} */
  awsCredentials?:
    | AwsCredentialIdentity
    | AWSCredentialsProvider<AwsCredentialIdentity>;
  /** Region for AWS based data sources to point towards, i.e. us-east-1 */
  awsRegion?: string | Provider<string>;
  settings?: SiteWiseDataSourceSettings;
}

export interface SiteWiseQuery {
  fetchTimeSeriesData: ({
    query,
    viewport,
    settings,
  }: {
    query: SiteWiseDataStreamQuery;
    viewport: Viewport;
    settings?: TimeSeriesDataRequestSettings;
  }) => Promise<DataStream[]>;
  timeSeriesData: (query: SiteWiseDataStreamQuery) => TimeSeriesDataQuery;
  anomalyData: (query: SiteWiseAnomalyDataStreamQuery) => AnomalyDataQuery;
  alarmData: (query: SiteWiseAlarmDataStreamQuery) => AlarmDataQuery;
}

/** Initialize IoT App Kit */
export const initialize = (input: SiteWiseDataSourceInitInputs) => {
  const siteWiseClient = getSiteWiseClient(input);
  const iotEventsClient = getIotEventsClient(input);

  const assetDataSource: SiteWiseAssetDataSource =
    createSiteWiseAssetDataSource(siteWiseClient);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const siteWiseTimeSeriesModule = new TimeSeriesDataModule(
    createDataSource(siteWiseClient, input.settings)
  );
  const siteWiseAlarmModule = new SiteWiseAlarmModule(
    iotEventsClient,
    siteWiseAssetModule
  );

  const timeSeriesData = (
    query: SiteWiseDataStreamQuery
  ): TimeSeriesDataQuery => ({
    toQueryString: () =>
      JSON.stringify({
        source: SOURCE,
        queryType: 'time-series-data',
        query,
      }),
    build: (sessionId: string, params: TimeSeriesDataRequest) =>
      new SiteWiseTimeSeriesDataProvider(
        new SiteWiseComponentSession({
          componentId: sessionId,
          siteWiseTimeSeriesModule,
          siteWiseAssetModule,
          siteWiseAlarmModule,
        }),
        {
          queries: [query],
          request: params,
        }
      ),
    query,
  });

  return {
    query: {
      fetchTimeSeriesData: fetchTimeSeriesData(siteWiseTimeSeriesModule),
      timeSeriesData,
      anomalyData: (query: SiteWiseAnomalyDataStreamQuery) => ({
        query,
        iotSiteWiseClient: siteWiseClient,
      }),
      alarmData: (query: SiteWiseAlarmDataStreamQuery) => ({
        query,
        iotSiteWiseClient: siteWiseClient,
        iotEventsClient: iotEventsClient,
        //  This will allow useAlarms to call timeSeriesData for the input properties
        timeSeriesData,
      }),
    },
  };
};
