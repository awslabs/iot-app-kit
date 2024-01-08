import {
  DescribeAssetCommand,
  GetAssetPropertyValueCommand,
  IoTSiteWiseClient,
  DescribeAssetModelCommand,
  ListAssetsCommand,
  ListAssociatedAssetsCommand,
} from '@aws-sdk/client-iotsitewise';
import type {
  DescribeAssetCommandInput,
  DescribeAssetCommandOutput,
  GetAssetPropertyValueCommandOutput,
  GetAssetPropertyValueCommandInput,
  DescribeAssetModelCommandInput,
  DescribeAssetModelCommandOutput,
  ListAssetsCommandInput,
  ListAssetsCommandOutput,
  ListAssociatedAssetsCommandInput,
  ListAssociatedAssetsCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import type { SiteWiseAssetDataSource } from './sitewise/types';
import { DescribeModeledDataStreamRequest } from './describeModeledDataStreamRequest/describeModeledDataStreamRequest';

export const createSiteWiseAssetDataSource = (
  api: IoTSiteWiseClient
): SiteWiseAssetDataSource => {
  const describeModeledDataStreamRequest = new DescribeModeledDataStreamRequest(
    api
  );

  return {
    describeAsset: (
      input: DescribeAssetCommandInput
    ): Promise<DescribeAssetCommandOutput> => {
      return api.send(new DescribeAssetCommand(input));
    },

    getPropertyValue: (
      input: GetAssetPropertyValueCommandInput
    ): Promise<GetAssetPropertyValueCommandOutput> => {
      return api.send(new GetAssetPropertyValueCommand(input));
    },

    describeAssetModel: (
      input: DescribeAssetModelCommandInput
    ): Promise<DescribeAssetModelCommandOutput> => {
      return api.send(new DescribeAssetModelCommand(input));
    },

    listAssets: (
      input: ListAssetsCommandInput
    ): Promise<ListAssetsCommandOutput> => {
      return api.send(new ListAssetsCommand(input));
    },

    listAssociatedAssets: (
      input: ListAssociatedAssetsCommandInput
    ): Promise<ListAssociatedAssetsCommandOutput> => {
      return api.send(new ListAssociatedAssetsCommand(input));
    },

    describeModeledDataStream: (input: {
      assetPropertyId: string;
      assetId: string;
      assetModelId: string;
    }) => {
      return describeModeledDataStreamRequest.send(input);
    },
  };
};
