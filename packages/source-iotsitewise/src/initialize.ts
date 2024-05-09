import type {
  AwsCredentialIdentity,
  Provider as AWSCredentialsProvider,
  Provider,
} from '@aws-sdk/types';
import {
  TreeQuery,
  TimeSeriesDataRequest,
  TimeSeriesDataQuery,
  TimeSeriesDataModule,
  Viewport,
  DataStream,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { getIotEventsClient, getSiteWiseClient } from '@iot-app-kit/core-util';
import { SiteWiseTimeSeriesDataProvider } from './time-series-data/provider';
import {
  BranchReference,
  SiteWiseAssetModule,
  SiteWiseAssetTreeSession,
} from './asset-modules';
import { SiteWiseComponentSession } from './component-session';
import { createSiteWiseAssetDataSource } from './asset-modules/asset-data-source';
import { createDataSource } from './time-series-data';
import { assetSession } from './sessions';
import { SiteWiseAlarmModule } from './alarms/iotevents';
import type {
  SiteWiseAnomalyDataStreamQuery,
  SiteWiseDataSourceSettings,
  SiteWiseDataStreamQuery,
} from './time-series-data/types';
import type {
  RootedSiteWiseAssetTreeQueryArguments,
  SiteWiseAssetDataSource,
  SiteWiseAssetTreeNode,
  SiteWiseAssetTreeQueryArguments,
} from './asset-modules';
import { fetchTimeSeriesData } from './time-series-data/fetchTimeSeriesData';

const SOURCE = 'iotsitewise';

export type AnomalyDataQuery = {
  query: SiteWiseAnomalyDataStreamQuery;
  iotSiteWiseClient: IoTSiteWiseClient;
};

export type SiteWiseDataSourceInitInputs = {
  iotSiteWiseClient?: IoTSiteWiseClient;
  iotEventsClient?: IoTEventsClient;
  awsCredentials?:
    | AwsCredentialIdentity
    | AWSCredentialsProvider<AwsCredentialIdentity>;
  awsRegion?: string | Provider<string>;
  settings?: SiteWiseDataSourceSettings;
};

export type SiteWiseQuery = {
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
  assetTree: {
    fromRoot: (
      query?: SiteWiseAssetTreeQueryArguments
    ) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
    fromAsset: (
      query: RootedSiteWiseAssetTreeQueryArguments
    ) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
  };
};

/**
 * Initialize IoT App Kit
 *
 * @param awsCredentials - https://www.npmjs.com/package/@aws-sdk/credential-providers
 * @param awsRegion - Region for AWS based data sources to point towards, i.e. us-east-1
 */
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

  return {
    query: {
      fetchTimeSeriesData: fetchTimeSeriesData(siteWiseTimeSeriesModule),
      timeSeriesData: (
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
      }),
      anomalyData: (query: SiteWiseAnomalyDataStreamQuery) => ({
        query,
        iotSiteWiseClient: siteWiseClient,
      }),

      assetTree: {
        fromRoot: (
          args: SiteWiseAssetTreeQueryArguments = {}
        ): TreeQuery<SiteWiseAssetTreeNode[], BranchReference> => ({
          toQueryString: () =>
            JSON.stringify({
              source: SOURCE,
              queryType: 'assets-from-root',
              query: args,
            }),
          build: (sessionId: string) => {
            const session = new SiteWiseComponentSession({
              componentId: sessionId,
              siteWiseTimeSeriesModule,
              siteWiseAssetModule,
              siteWiseAlarmModule,
            });
            return new SiteWiseAssetTreeSession(assetSession(session), args);
          },
        }),
        fromAsset: (
          args: RootedSiteWiseAssetTreeQueryArguments
        ): TreeQuery<SiteWiseAssetTreeNode[], BranchReference> => {
          return {
            toQueryString: () =>
              JSON.stringify({
                source: SOURCE,
                queryType: 'assets-from-asset',
                query: args,
              }),
            build: (sessionId: string) => {
              const session = new SiteWiseComponentSession({
                componentId: sessionId,
                siteWiseTimeSeriesModule,
                siteWiseAssetModule,
                siteWiseAlarmModule,
              });
              return new SiteWiseAssetTreeSession(assetSession(session), args);
            },
          };
        },
      },
    },
  };
};
