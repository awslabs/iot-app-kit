import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { ErrorDetails } from '@iot-app-kit/core';
import { SiteWiseDataStreamQuery } from '../../time-series-data/types';
import { SiteWiseAssetSession } from '../index';
import { isDefined } from '../../common/predicates';

export async function* fetchAssetModelsFromQuery({
  queries,
  assetModuleSession,
}: {
  queries: SiteWiseDataStreamQuery[];
  assetModuleSession: SiteWiseAssetSession;
}): AsyncGenerator<
  { assetModels: Record<string, DescribeAssetModelResponse> } | { errors: Record<string, ErrorDetails> }
> {
  const assetQueries = queries.map((query) => ('assets' in query ? query.assets : undefined)).filter(isDefined);

  for (const assets of assetQueries) {
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
