import { IoTSiteWiseClient, DescribeAssetCommand, DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import { HIERARCHY_ROOT_ID } from '.';

const blank = {
  assetId: undefined,
  assetArn: undefined,
  assetName: undefined,
  assetModelId: undefined,
  assetProperties: [],
  assetHierarchies: [],
  assetCompositeModels: [],
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
  assetDescription: undefined,
} as DescribeAssetResponse;

export const sendCommand = (client: IoTSiteWiseClient, assetId: string) =>
  client.send(new DescribeAssetCommand({ assetId }));

export const describeCurrentAsset = async (currentBranchId: string, client: IoTSiteWiseClient | undefined) => {
  if (!client) return blank;

  const describeAsset = async (assetId: string) => {
    const response = await sendCommand(client, assetId);
    return response;
  };

  // Do not attempt to retrieve properties for the root asset
  if (currentBranchId === HIERARCHY_ROOT_ID) return blank;

  try {
    // Attempt to describeAsset. Return nothing if this fails.
    const asset = await describeAsset(currentBranchId);
    if (!asset?.assetId || !asset?.assetProperties) return blank;
    return asset;
  } catch (err) {
    console.log(err);
    return blank;
  }
};
