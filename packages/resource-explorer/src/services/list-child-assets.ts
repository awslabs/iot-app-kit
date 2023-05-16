import { IoTSiteWiseClient, ListAssociatedAssetsCommand } from '@aws-sdk/client-iotsitewise';

const client = new IoTSiteWiseClient({
  region: 'us-east-1',
});

interface ListChildAssetsInput {
  assetId: string;
  hierarchyId: string;
  pageSize: number;
  nextToken?: string;
}

export async function listChildAssets(input: ListChildAssetsInput) {
  const command = new ListAssociatedAssetsCommand({
    assetId: input.assetId,
    hierarchyId: input.hierarchyId,
    maxResults: input.pageSize,
    nextToken: input.nextToken,
    traversalDirection: 'CHILD',
  });

  const response = await client.send(command);

  return {
    assets: response.assetSummaries ?? [],
    nextToken: response.nextToken,
  };
}
