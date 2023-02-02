import { IoTSiteWiseClient, DescribeAssetCommand } from '@aws-sdk/client-iotsitewise';
import { getEnvCredentials } from '../../../testing/getEnvCredentials';
import { HIERARCHY_ROOT_ID } from '.';
import { REGION } from '../../../testing/siteWiseQueries';

const blank = { asset: null };

export const describeCurrentAsset = async (currentBranchId: string) => {
  let client: IoTSiteWiseClient;
  try {
    client = new IoTSiteWiseClient({
      region: REGION,
      credentials: getEnvCredentials(),
    });
  } catch (e) {
    console.log(e);
    return blank;
  }

  const describeAsset = async (assetId: string) => {
    const command = new DescribeAssetCommand({ assetId, excludeProperties: false });
    const response = await client.send(command);
    return response;
  };

  // Do not attempt to retrieve properties for the root asset
  if (currentBranchId === HIERARCHY_ROOT_ID) return blank;

  try {
    // Attempt to describeAsset. Return nothing if this fails.
    const asset = await describeAsset(currentBranchId);
    if (!asset?.assetId || !asset?.assetProperties) return blank;
    return { asset };
  } catch (err) {
    console.log(err);
    return blank;
  }
};
