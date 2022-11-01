import { SiteWiseAssetQuery, TimeQuery, TimeSeriesData, TimeSeriesDataRequest, TreeQuery } from '@iot-app-kit/core';
import {
  BranchReference,
  RootedSiteWiseAssetTreeQueryArguments,
  SiteWiseAssetTreeNode,
  SiteWiseAssetTreeQueryArguments,
} from '@iot-app-kit/source-iotsitewise/dist/types/source-iotsitewise/src/asset-modules';
export declare const DEMO_TURBINE_ASSET_1: string;
export declare const DEMO_TURBINE_ASSET_1_PROPERTY_1: string;
export declare const DEMO_TURBINE_ASSET_1_PROPERTY_2: string;
export declare const DEMO_TURBINE_ASSET_1_PROPERTY_3: string;
export declare const DEMO_TURBINE_ASSET_1_PROPERTY_4: string;
export declare const ASSET_DETAILS_QUERY: {
  assetId: string;
};
export declare const AGGREGATED_DATA_QUERY: {
  assets: {
    assetId: string;
    properties: (
      | {
          propertyId: string;
          resolution: string;
          refId: string;
        }
      | {
          propertyId: string;
          resolution?: undefined;
          refId?: undefined;
        }
    )[];
  }[];
};
export declare const query: {
  timeSeriesData: (assetQuery: SiteWiseAssetQuery) => TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  assetTree: {
    fromRoot: (args?: SiteWiseAssetTreeQueryArguments) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
    fromAsset: (args: RootedSiteWiseAssetTreeQueryArguments) => TreeQuery<SiteWiseAssetTreeNode[], BranchReference>;
  };
};
