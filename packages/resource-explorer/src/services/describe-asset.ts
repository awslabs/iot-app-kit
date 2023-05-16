import { IoTSiteWiseClient, DescribeAssetCommand } from '@aws-sdk/client-iotsitewise';

const client = new IoTSiteWiseClient({
  region: 'us-east-1',
});

interface DescribeAssetInput {
  assetId: string;
}

export async function describeAsset(input: DescribeAssetInput) {
  return client.send(new DescribeAssetCommand({ assetId: input.assetId }));
}
