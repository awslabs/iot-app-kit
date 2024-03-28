import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import React, { useMemo, useState } from 'react';
import { Link } from '@cloudscape-design/components';

import { useAssets } from './use-assets';
import { AssetTableHierarchyPath } from './asset-table-hierarchy-path';
import { ResourceTable } from '../resource-table/resource-table';
import { useResourceTablePreferences } from '../resource-table/use-resource-table-preferences';
import type {
  DescribeAsset,
  ListAssets,
  ListAssociatedAssets,
} from '../types/data-source';
import type { ResourceExplorerProps } from '../types/resource-explorer';
import { createAssetExplorerSchema } from './constants';

// TODO: make these optional and handle correctly
export interface AssetExplorerDataSource {
  describeAsset: DescribeAsset;
  listAssets: ListAssets;
  listAssociatedAssets: ListAssociatedAssets;
}

export interface AssetExplorerProps
  extends ResourceExplorerProps<AssetSummary> {
  /** Optionally list assets by asset models. */
  assetModelIds?: string[];

  /** Specify methods for calling AWS APIs. */
  dataSource: AssetExplorerDataSource;
}

function isListingAssetsByAssetModel(assetModelIds: string[]): boolean {
  return assetModelIds.length > 0;
}

/**
 * Explore AWS IoT SiteWise assets.
 *
 * @experimental
 */
export function AssetExplorer({
  selectedResources,
  assetModelIds = [],
  onSelectionChange,
  dataSource,
  selectionType,
  isResourceDisabled,
  preferencesEnabled,
  filterEnabled,
}: AssetExplorerProps) {
  const [assetId, setAssetId] = useState<string | undefined>(undefined);

  const schema = useMemo(
    () =>
      createAssetExplorerSchema({
        renderName: ({ name, hierarchies = [], id }) => {
          return !isListingAssetsByAssetModel(assetModelIds) &&
            hierarchies.length > 0 ? (
            <Link onFollow={() => setAssetId(id)}>{name}</Link>
          ) : (
            name
          );
        },
      }),
    [...assetModelIds]
  );

  const [preferences, setPreferences] = useResourceTablePreferences({
    schema,
  });

  const { assets, isLoading, hasNextPage, nextPage } = useAssets({
    assetId,
    assetModelIds,
    describeAsset: dataSource.describeAsset,
    listAssets: dataSource.listAssets,
    listAssociatedAssets: dataSource.listAssociatedAssets,
    pageSize: preferences.pageSize ?? 10,
  });

  return (
    <ResourceTable
      preferences={preferences}
      setPreferences={setPreferences}
      schema={schema}
      hasNextPage={hasNextPage}
      onNextPageClick={nextPage}
      isLoading={isLoading}
      resources={assets}
      extendedHeader={
        !isListingAssetsByAssetModel(assetModelIds) ? (
          <AssetTableHierarchyPath
            assetId={assetId}
            onClickAssetName={setAssetId}
            describeAsset={dataSource.describeAsset}
            listAssociatedAssets={dataSource.listAssociatedAssets}
          />
        ) : null
      }
      preferencesEnabled={preferencesEnabled}
      filterEnabled={filterEnabled}
      isResourceDisabled={isResourceDisabled}
      selectionType={selectionType}
      selectedResources={selectedResources}
      onSelectionChange={
        onSelectionChange != null
          ? ({ detail }) => onSelectionChange(detail.selectedItems)
          : undefined
      }
    />
  );
}
