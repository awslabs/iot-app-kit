import { SiteWiseTimeSeriesDataProvider } from './time-series-data/provider';
import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { BranchReference, SiteWiseAssetModule, SiteWiseAssetTreeSession } from './asset-modules';
import { SiteWiseComponentSession } from './component-session';
import { getSiteWiseClient } from './sitewise-sdk';
import { getIotEventsClient } from './events-sdk';
import { createSiteWiseAssetDataSource } from './asset-modules/asset-data-source';
import { createDataSource } from './time-series-data';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { assetSession } from './sessions';
import { SiteWiseAlarmModule } from './alarms/iotevents';
import type { TreeQuery, TimeSeriesDataRequest, TimeSeriesDataQuery } from '@iot-app-kit/core';
import type { SiteWiseAssetQuery, SiteWiseDataSourceSettings, SiteWiseDataStreamQuery } from './time-series-data/types';
import type {
  RootedSiteWiseAssetTreeQueryArguments,
  SiteWiseAssetDataSource,
  SiteWiseAssetTreeNode,
  SiteWiseAssetTreeQueryArguments,
} from './asset-modules';
import type { Credentials, Provider as AWSCredentialsProvider } from '@aws-sdk/types';

const SOURCE = 'iotsitewise';

export type SiteWiseDataSourceInitInputs = {
  iotSiteWiseClient?: IoTSiteWiseClient;
  iotEventsClient?: IoTEventsClient;
  awsCredentials?: Credentials | AWSCredentialsProvider<Credentials>;
  awsRegion?: string;
  settings?: SiteWiseDataSourceSettings;
};

export type SiteWiseQuery = {
  timeSeriesData: (query: SiteWiseAssetQuery) => TimeSeriesDataQuery;
  assetTree: {
    fromRoot: (query?: SiteWiseAssetTreeQueryArguments) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
    fromAsset: (query: RootedSiteWiseAssetTreeQueryArguments) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
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

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(siteWiseClient);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const siteWiseTimeSeriesModule = new TimeSeriesDataModule(createDataSource(siteWiseClient, input.settings));
  const siteWiseAlarmModule = new SiteWiseAlarmModule(iotEventsClient, siteWiseAssetModule);

  return {
    query: {
      timeSeriesData: (query: SiteWiseDataStreamQuery): TimeSeriesDataQuery => ({
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

      assetTree: {
        fromRoot: (
          args: SiteWiseAssetTreeQueryArguments = {}
        ): TreeQuery<SiteWiseAssetTreeNode[], BranchReference> => ({
          toQueryString: () => JSON.stringify({ source: SOURCE, queryType: 'assets-from-root', query: args }),
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
            toQueryString: () => JSON.stringify({ source: SOURCE, queryType: 'assets-from-asset', query: args }),
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
