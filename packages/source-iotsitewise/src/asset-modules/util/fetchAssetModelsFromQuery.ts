import { SiteWiseAssetSession } from '../index';
import { isDefined } from '../../common/predicates';
import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import type { ErrorDetails } from '@iot-app-kit/core';
import type { SiteWiseDataStreamQuery } from '../../time-series-data/types';

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
