import {
  DescribeAssetCommand,
  DescribeAssetCommandInput,
  DescribeAssetCommandOutput,
  GetAssetPropertyValueCommand,
  GetAssetPropertyValueCommandOutput,
  GetAssetPropertyValueCommandInput,
  IoTSiteWiseClient,
  DescribeAssetModelCommand,
  ListAssetsCommand,
  ListAssociatedAssetsCommand,
  DescribeAssetModelCommandInput,
  DescribeAssetModelCommandOutput,
  ListAssetsCommandInput,
  ListAssetsCommandOutput,
  ListAssociatedAssetsCommandInput,
  ListAssociatedAssetsCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetDataSource } from '../../data-module/types';

export const createSiteWiseAssetDataSource = (api: IoTSiteWiseClient): SiteWiseAssetDataSource => {
  return {
    describeAsset: (input: DescribeAssetCommandInput): Promise<DescribeAssetCommandOutput> => {
      return api.send(new DescribeAssetCommand(input));
    },

    getPropertyValue: (input: GetAssetPropertyValueCommandInput): Promise<GetAssetPropertyValueCommandOutput> => {
      return api.send(new GetAssetPropertyValueCommand(input));
    },

    describeAssetModel: (input: DescribeAssetModelCommandInput): Promise<DescribeAssetModelCommandOutput> => {
      return api.send(new DescribeAssetModelCommand(input));
    },

    listAssets: (input: ListAssetsCommandInput): Promise<ListAssetsCommandOutput> => {
      return api.send(new ListAssetsCommand(input));
    },

    listAssociatedAssets: (input: ListAssociatedAssetsCommandInput): Promise<ListAssociatedAssetsCommandOutput> => {
      return api.send(new ListAssociatedAssetsCommand(input));
    },
  };
};
