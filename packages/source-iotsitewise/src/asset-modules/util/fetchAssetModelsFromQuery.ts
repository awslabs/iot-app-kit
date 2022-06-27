import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetDataStreamQuery } from '../../time-series-data/types';
import { ErrorDetails } from '@iot-app-kit/core';
import { SiteWiseAssetSession } from '../index';

export async function* fetchAssetModelsFromQuery({
  queries,
  assetModuleSession,
}: {
  queries: SiteWiseAssetDataStreamQuery[];
  assetModuleSession: SiteWiseAssetSession;
}): AsyncGenerator<
  { assetModels: Record<string, DescribeAssetModelResponse> } | { errors: Record<string, ErrorDetails> }
> {
  for (const { assets } of queries) {
    for (const asset of assets) {
      try {
        const { assetModelId } = await assetModuleSession.fetchAssetSummary({ assetId: asset.assetId });

        const assetModelResponse = assetModelId && (await assetModuleSession.fetchAssetModel({ assetModelId }));

        if (assetModelResponse) {
          yield { assetModels: { [asset.assetId]: assetModelResponse } };
        }
      } catch (err) {
        yield { errors: { [asset.assetId]: err as ErrorDetails } };
      }
    }
  }
}
