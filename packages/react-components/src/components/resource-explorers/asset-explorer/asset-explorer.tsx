import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { Link } from '@cloudscape-design/components';
import React, { useState } from 'react';

import { useAssets } from './use-assets';
import { AssetTableHierarchyPath } from './asset-table-hierarchy-path';
import { ResourceTable } from '../resource-table/resource-table';
import type {
  DescribeAsset,
  ListAssets,
  ListAssociatedAssets,
} from '../types/data-source';
import type { ResourceExplorerProps } from '../types/resource-explorer';

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

function isParentAsset({
  hierarchies = [],
}: Pick<AssetSummary, 'hierarchies'>): boolean {
  return hierarchies?.length > 0;
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

  const { assets, isLoading, hasNextPage, nextPage } = useAssets({
    assetId,
    assetModelIds,
    describeAsset: dataSource.describeAsset,
    listAssets: dataSource.listAssets,
    listAssociatedAssets: dataSource.listAssociatedAssets,
    pageSize: 5,
  });

  return (
    <ResourceTable
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
      schema={{
        name: 'Asset',
        pluralName: 'Assets',
        properties: [
          {
            id: 'arn',
            name: 'ARN',
            pluralName: 'ARNs',
            render: (resource) => resource.arn,
            filterOperators: ['=', '!=', ':', '!:'],
          },
          {
            id: 'id',
            name: 'ID',
            pluralName: 'IDs',
            render: (resource) => resource.id,
            filterOperators: ['=', '!=', ':', '!:'],
          },
          {
            id: 'description',
            name: 'Description',
            pluralName: 'Descriptions',
            render: (resource) => resource.description,
            filterOperators: ['=', '!=', ':', '!:'],
          },
          {
            id: 'name',
            name: 'Name',
            pluralName: 'Names',
            render: ({ name, hierarchies = [], id }) => {
              return !isListingAssetsByAssetModel(assetModelIds) &&
                isParentAsset({ hierarchies }) ? (
                <Link onFollow={() => setAssetId(id)}>{name}</Link>
              ) : (
                name
              );
            },
            filterOperators: ['=', '!=', ':', '!:'],
          },
        ],
      }}
    />
  );
}
