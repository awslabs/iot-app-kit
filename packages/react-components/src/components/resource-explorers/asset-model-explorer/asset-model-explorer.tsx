import type { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useAssetModels } from '../queries/use-asset-models';
import { ASSET_MODEL_EXPLORER_SCHEMA } from './constants';
import { ResourceTable } from '../resource-table/resource-table';
import { useResourceTablePreferences } from '../resource-table/use-resource-table-preferences';
import type { ResourceExplorerProps } from '../types/resource-explorer';
import type { ListAssetModels } from '../types/data-source';

interface AssetModelExplorerDataSource {
  listAssetModels: ListAssetModels;
}

export interface AssetModelExplorerProps
  extends ResourceExplorerProps<AssetModelSummary> {
  dataSource: AssetModelExplorerDataSource;
  assetModelTypes?: Parameters<ListAssetModels>[0]['assetModelTypes'];
}

/**
 * Explore AWS IoT SiteWise asset models.
 *
 * @experimental
 *
 * Do not use in production.
 */
export function AssetModelExplorer({
  dataSource: { listAssetModels },
  assetModelTypes,
  filterEnabled,
  preferencesEnabled,
  selectionType,
  selectedResources,
  onSelectionChange,
}: AssetModelExplorerProps) {
  const [preferences, setPreferences] = useResourceTablePreferences({
    schema: ASSET_MODEL_EXPLORER_SCHEMA,
  });

  const { assetModels, isLoading, hasNextPage, fetchNextPage, error } =
    useAssetModels({
      listAssetModels,
      assetModelTypes,
      pageSize: preferences.pageSize ?? 10,
    });

  return (
    <ResourceTable
      error={error}
      preferences={preferences}
      setPreferences={setPreferences}
      hasNextPage={hasNextPage}
      onNextPageClick={fetchNextPage}
      isLoading={isLoading}
      filterEnabled={filterEnabled}
      selectedResources={selectedResources}
      onSelectionChange={({ detail }) =>
        onSelectionChange && onSelectionChange(detail.selectedItems ?? [])
      }
      preferencesEnabled={preferencesEnabled}
      selectionType={selectionType}
      resources={assetModels}
      schema={ASSET_MODEL_EXPLORER_SCHEMA}
    />
  );
}
