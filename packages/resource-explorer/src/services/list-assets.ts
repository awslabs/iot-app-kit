import { IoTSiteWiseClient, ListAssetsCommand } from '@aws-sdk/client-iotsitewise';

const client = new IoTSiteWiseClient({
  region: 'us-east-1',
});

export async function listAssets({
  assetModelId,
  pageSize,
  nextToken,
}: {
  assetModelId?: string;
  pageSize: number;
  nextToken?: string;
}) {
  const command = new ListAssetsCommand({
    filter: assetModelId ? 'ALL' : 'TOP_LEVEL',
    maxResults: pageSize,
    assetModelId,
    nextToken,
  });
  const response = await client.send(command);

  return {
    assets: response.assetSummaries ?? [],
    nextToken: response.nextToken,
  };
}
