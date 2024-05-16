import type { ExecuteQuery } from '../types/request-fn';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../types/requests';
import { AssetPropertyResource } from '../types/resources';
import { useExecuteQuery } from './use-execute-query';

export interface UseAssetPropertySearchOptions extends UseListAPIBaseOptions {
  userSearchStatement?: string;
  executeQuery: ExecuteQuery;
}

export interface UseAssetPropertySearchResult extends UseListAPIBaseResult {
  assetProperties: AssetPropertyResource[];
}

export function useAssetPropertySearch({
  userSearchStatement,
  executeQuery,
  pageSize: maxResults,
  isEnabled,
}: UseAssetPropertySearchOptions): UseAssetPropertySearchResult {
  // TODO: Handle data type bug
  const queryStatement = `
    SELECT p.property_id, p.property_name, p.asset_id, p.property_alias
    FROM asset_property p
    WHERE p.property_name LIKE '%${userSearchStatement}%'
  `;

  const { resources, ...executeQueryResult } = useExecuteQuery({
    isEnabled: Boolean(userSearchStatement) && isEnabled,
    queryStatement,
    executeQuery,
    pageSize: maxResults,
  });

  // @ts-expect-error TODO
  const assetProperties: AssetPropertyResource[] = resources.map((result) => {
    const searchResult = result as {
      data: [
        { scalarValue?: string },
        { scalarValue?: string },
        { scalarValue?: string },
        { scalarValue?: string }
      ];
    };

    return {
      id: searchResult.data[0].scalarValue ?? '',
      name: searchResult.data[1].scalarValue ?? '',
      assetId: searchResult.data[2].scalarValue ?? '',
      alias: searchResult.data[3].scalarValue ?? undefined,
      // TODO: Handle
      dataType: '',
    };
  });

  return { assetProperties, ...executeQueryResult };
}
