import type { SearchedAssetsRequestParameters } from '../../asset-explorer/types';
import { useMultipleListRequests } from '../../../requests/use-multiple-list-requests';
import { type ExecuteQuery } from '@iot-app-kit/core';
import {
  type UseListAPIBaseOptions,
  type UseListAPIBaseResult,
} from '../../../types/requests';
import type { AssetPropertyResource } from '../../../types/resources';
import { normalizeSearchStatement } from '../../../helpers/search-statement-normalizer';

export interface UseAssetPropertySearchOptions extends UseListAPIBaseOptions {
  parameters: readonly SearchedAssetsRequestParameters[];
  executeQuery?: ExecuteQuery;
}

export interface UseAssetPropertySearchResult extends UseListAPIBaseResult {
  assetProperties: AssetPropertyResource[];
}

export function useAssetPropertySearch({
  parameters,
  executeQuery,
  pageSize,
}: UseAssetPropertySearchOptions): UseAssetPropertySearchResult {
  const executeQueryParameters = parameters.map(({ searchStatement }) => {
    const normalizedSearchStatement = normalizeSearchStatement(searchStatement);
    const queryStatement = `
      SELECT p.property_id, p.property_name, p.asset_id, p.property_alias, p.property_data_type
      FROM asset_property p
      WHERE p.property_name LIKE '${normalizedSearchStatement}'
    `;

    return {
      queryStatement,
    };
  });

  const { resources: assetProperties, ...listRequestResult } =
    useMultipleListRequests({
      isEnabled: parameters.length > 0 && executeQuery !== undefined,
      pageSize,
      resourceId: 'AssetProperty(searched)',
      parameters: executeQueryParameters,
      requestFn: executeQuery,
      responseTransformer: ({ rows = [] }) => {
        return rows.map((row) => {
          const searchResult = row as {
            data: [
              { scalarValue?: string },
              { scalarValue?: string },
              { scalarValue?: string },
              { scalarValue?: string },
              { scalarValue?: string }
            ];
          };

          const assetProperty = {
            propertyId: searchResult.data[0].scalarValue ?? '',
            name: searchResult.data[1].scalarValue ?? '',
            assetId: searchResult.data[2].scalarValue ?? '',
            alias: searchResult.data[3].scalarValue ?? undefined,
            dataType: searchResult.data[4].scalarValue ?? '',
          } satisfies AssetPropertyResource;

          return assetProperty;
        });
      },
    });

  return { assetProperties, ...listRequestResult };
}
