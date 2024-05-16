import { useMultipleListRequests } from '../use-multiple-list-requests';
import type { ExecuteQuery } from '../../types/request-fn';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import type { AssetResource } from '../../types/resources';
import type { SearchedAssetsRequestParameters } from '../../explorers/asset-explorer/types';

export interface UseAssetSearchOptions extends UseListAPIBaseOptions {
  parameters: readonly SearchedAssetsRequestParameters[];
  executeQuery?: ExecuteQuery;
}

export interface UseAssetSearchResult extends UseListAPIBaseResult {
  assets: AssetResource[];
}

export function useAssetSearch({
  parameters,
  executeQuery,
  pageSize,
}: UseAssetSearchOptions): UseAssetSearchResult {
  const executeQueryParameters = parameters.map(({ searchStatement }) => {
    const queryStatement = `
    SELECT a.asset_id, a.asset_name, a.asset_description, a.asset_model_id
    FROM asset a
    WHERE a.asset_name LIKE '%${searchStatement}%'
  `;

    return {
      queryStatement,
    };
  });

  const { resources: assets, ...listRequestResult } = useMultipleListRequests({
    isEnabled: parameters.length > 0 && Boolean(executeQuery),
    pageSize,
    resourceId: 'Asset(searched)',
    parameters: executeQueryParameters,
    requestFn: executeQuery,
    responseTransformer: ({ rows = [] }) => {
      return rows.map((row) => {
        const searchResult = row as {
          data: [
            { scalarValue?: string },
            { scalarValue?: string },
            { scalarValue?: string },
            { scalarValue?: string }
          ];
        };

        return {
          assetId: searchResult.data[0].scalarValue ?? '',
          name: searchResult.data[1].scalarValue ?? '',
          description: searchResult.data[2].scalarValue ?? '',
          assetModelId: searchResult.data[3].scalarValue ?? '',
          hierarchies: [],
        } satisfies AssetResource;
      });
    },
  });

  return { assets, ...listRequestResult };
}
