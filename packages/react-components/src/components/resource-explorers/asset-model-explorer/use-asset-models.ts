import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';

import { Paginator } from '../helpers/paginator';
import type { ListAssetModels } from '../types/data-source';

export interface UseAssetModelsOptions {
  listAssetModels: ListAssetModels;
  assetModelTypes?: Parameters<ListAssetModels>[0]['assetModelTypes'];
}

export function useAssetModels({
  listAssetModels,
  assetModelTypes,
}: UseAssetModelsOptions) {
  const { data: assetModels = [], ...queryResult } = useQuery({
    queryKey: createQueryKey({ assetModelTypes }),
    queryFn: createQueryFn(listAssetModels),
  });

  return { assetModels, ...queryResult };
}

function createQueryKey({
  assetModelTypes,
}: {
  assetModelTypes?: Parameters<ListAssetModels>[0]['assetModelTypes'];
}) {
  return [
    {
      resource: 'Asset Model',
      assetModelTypes,
    },
  ] as const;
}

function createQueryFn(listAssetModels: ListAssetModels) {
  const paginator = new Paginator(listAssetModels);

  return async function queryFn({
    queryKey: [{ assetModelTypes }],
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    const pages = await paginator.paginate({ assetModelTypes });
    const assetModels = pages.flatMap(
      ({ assetModelSummaries = [] }) => assetModelSummaries
    );

    return assetModels;
  };
}
