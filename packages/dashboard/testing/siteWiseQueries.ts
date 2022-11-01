// import * as core from '@iot-app-kit/core';
import { SiteWiseAssetQuery, TimeQuery, TimeSeriesData, TimeSeriesDataRequest, TreeQuery } from '@iot-app-kit/core';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import {
  BranchReference,
  RootedSiteWiseAssetTreeQueryArguments,
  SiteWiseAssetTreeNode,
  SiteWiseAssetTreeQueryArguments,
} from '@iot-app-kit/source-iotsitewise/dist/types/source-iotsitewise/src/asset-modules';
import { getEnvCredentials } from './getEnvCredentials';

const REGION = process.env.REGION || '';

const STRING_ASSET_ID = process.env.STRING_ASSET_ID || '';

export const DEMO_TURBINE_ASSET_1 = process.env.DEMO_TURBINE_ASSET_1 || '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = process.env.DEMO_TURBINE_ASSET_1_PROPERTY_1 || '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = process.env.DEMO_TURBINE_ASSET_1_PROPERTY_2 || '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = process.env.DEMO_TURBINE_ASSET_1_PROPERTY_3 || '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = process.env.DEMO_TURBINE_ASSET_1_PROPERTY_4 || '';

console.log(DEMO_TURBINE_ASSET_1);

export const ASSET_DETAILS_QUERY = {
  assetId: STRING_ASSET_ID,
};

const AGGREGATED_DATA_ASSET = STRING_ASSET_ID;
const AGGREGATED_DATA_PROPERTY = process.env.AGGREGATED_DATA_PROPERTY || '';
const AGGREGATED_DATA_PROPERTY_2 = process.env.AGGREGATED_DATA_PROPERTY_2 || '';

export const AGGREGATED_DATA_QUERY = {
  assets: [
    {
      assetId: AGGREGATED_DATA_ASSET,
      properties: [
        { propertyId: AGGREGATED_DATA_PROPERTY, resolution: '0', refId: 'testing' },
        { propertyId: AGGREGATED_DATA_PROPERTY_2 },
      ],
    },
  ],
};

export const query: {
  timeSeriesData: (assetQuery: SiteWiseAssetQuery) => TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  assetTree: {
    fromRoot: (args?: SiteWiseAssetTreeQueryArguments) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
    fromAsset: (args: RootedSiteWiseAssetTreeQueryArguments) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
  };
} = (() => {
  try {
    return initialize({ awsCredentials: getEnvCredentials(), awsRegion: REGION }).query;
  } catch (e) {
    return initialize({
      awsCredentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
      },
      awsRegion: 'us-west-2',
    }).query;
  }
})();

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
