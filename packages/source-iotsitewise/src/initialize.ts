import { SiteWiseTimeSeriesDataProvider } from './time-series-data/provider';
import { IotAppKitDataModule, TreeQuery, TimeQuery, TimeSeriesData, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { SiteWiseAssetQuery, SiteWiseDataSourceSettings } from './time-series-data/types';
import {
  BranchReference,
  RootedSiteWiseAssetTreeQueryArguments,
  SiteWiseAssetDataSource,
  SiteWiseAssetModule,
  SiteWiseAssetTreeNode,
  SiteWiseAssetTreeQueryArguments,
  SiteWiseAssetTreeSession,
} from './asset-modules';
import { SiteWiseComponentSession } from './component-session';
import { sitewiseSdk } from './sitewise-sdk';
import { createSiteWiseAssetDataSource } from './asset-modules/asset-data-source';
import { createDataSource } from './time-series-data';
import { Credentials, Provider as AWSCredentialsProvider } from '@aws-sdk/types';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { assetSession } from './sessions';

type SiteWiseDataSourceInitInputs = (
  | {
      registerDataSources?: boolean;
      iotSiteWiseClient: IoTSiteWiseClient;
    }
  | {
      registerDataSources?: boolean;
      awsCredentials: Credentials | AWSCredentialsProvider<Credentials>;
      awsRegion: string;
    }
) & {
  settings?: SiteWiseDataSourceSettings;
};

export type SiteWiseQuery = {
  timeSeriesData: (query: SiteWiseAssetQuery) => TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
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
  const siteWiseTimeSeriesModule = new IotAppKitDataModule();
  const siteWiseSdk =
    'iotSiteWiseClient' in input ? input.iotSiteWiseClient : sitewiseSdk(input.awsCredentials, input.awsRegion);

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(siteWiseSdk);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);

  if (input.registerDataSources !== false) {
    /** Automatically registered data sources */
    siteWiseTimeSeriesModule.registerDataSource(createDataSource(siteWiseSdk, input.settings));
  }

  return {
    query: {
      timeSeriesData: (assetQuery: SiteWiseAssetQuery): TimeQuery<TimeSeriesData[], TimeSeriesDataRequest> => ({
        build: (sessionId: string, params: TimeSeriesDataRequest) =>
          new SiteWiseTimeSeriesDataProvider(
            new SiteWiseComponentSession({ componentId: sessionId, siteWiseTimeSeriesModule, siteWiseAssetModule }),
            {
              queries: [
                {
                  source: 'site-wise',
                  ...assetQuery,
                },
              ],
              request: params,
            }
          ),
      }),

      assetTree: {
        fromRoot: (
          args: SiteWiseAssetTreeQueryArguments = {}
        ): TreeQuery<SiteWiseAssetTreeNode[], BranchReference> => ({
          build: (sessionId: string) => {
            const session = new SiteWiseComponentSession({
              componentId: sessionId,
              siteWiseTimeSeriesModule,
              siteWiseAssetModule,
            });
            return new SiteWiseAssetTreeSession(assetSession(session), args);
          },
        }),
        fromAsset: (
          args: RootedSiteWiseAssetTreeQueryArguments
        ): TreeQuery<SiteWiseAssetTreeNode[], BranchReference> => {
          return {
            build: (sessionId: string) => {
              const session = new SiteWiseComponentSession({
                componentId: sessionId,
                siteWiseTimeSeriesModule,
                siteWiseAssetModule,
              });
              return new SiteWiseAssetTreeSession(assetSession(session), args);
            },
          };
        },
      },
    },
  };
};
