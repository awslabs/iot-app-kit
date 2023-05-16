import { IoTSiteWiseClient, paginateListAssetModels, AssetModelSummary } from '@aws-sdk/client-iotsitewise';

const MAX_PAGE_SIZE = 250;

const client = new IoTSiteWiseClient({
  region: 'us-east-1',
});

// get all asset models in one go
// max of 1000 in account (soft limit)
export async function listAllAssetModels() {
  const paginatorConfig = {
    client,
    pageSize: MAX_PAGE_SIZE,
  };
  const paginator = paginateListAssetModels(paginatorConfig, {});

  const assetModels: AssetModelSummary[] = [];
  for await (const page of paginator) {
    assetModels.push(...(page.assetModelSummaries ?? []));
  }

  return assetModels;
}
