import { SiteWiseAssetSession } from '../index';
import { isDefined } from '../../common/predicates';
import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import type { ErrorDetails } from '@iot-app-kit/core';
import type { SiteWiseDataStreamQuery } from '../../time-series-data/types';
import { ModeledDataStream } from '../listAssetModelPropertiesWithCompositeModels';

export async function* fetchAssetModelsFromQuery({
  queries,
  assetModuleSession,
}: {
  queries: SiteWiseDataStreamQuery[];
  assetModuleSession: SiteWiseAssetSession;
}): AsyncGenerator<
  | { assetModels: Record<string, DescribeAssetModelResponse>; assetModelProperties: ModeledDataStream[] }
  | { errors: Record<string, ErrorDetails> }
> {
  const assetQueries = queries.map((query) => ('assets' in query ? query.assets : undefined)).filter(isDefined);

  for (const assets of assetQueries) {
    for (const asset of assets) {
      try {
        const { assetModelId } = await assetModuleSession.fetchAssetSummary({ assetId: asset.assetId });

        const assetModelResponse = assetModelId && (await assetModuleSession.fetchAssetModel({ assetModelId }));

        const listAssetModelPropertiesWithCompositeModelsResponse =
          await assetModuleSession.fetchListAssetModelPropertiesWithCompsiteModels({
            assetId: asset.assetId,
            assetModelId: assetModelId ?? '',
          });

        if (assetModelResponse) {
          yield {
            assetModels: { [asset.assetId]: assetModelResponse },
            assetModelProperties: listAssetModelPropertiesWithCompositeModelsResponse,
          };
        }
      } catch (err) {
        yield { errors: { [asset.assetId]: err as ErrorDetails } };
      }
    }
  }
}
