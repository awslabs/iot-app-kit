import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import Link from '@cloudscape-design/components/link';
import React, { useRef } from 'react';

import { ResourceTable, ResourceTableProps } from './resource-table';
import type { ConcreteResourceTableProps } from './types';
import type { AssetName } from '../types/resource';
import { createDefaultAssetTableProperties } from '../constants/defaults/table-properties';

export interface AssetTableProps
  extends ConcreteResourceTableProps<AssetSummary, AssetName> {
  /**
   * Called when the name of an asset name link is clicked.
   */
  onAssetNameClick: (assetId?: string) => void;

  /**
   * Specify if the table should render an asset model asset exploration
   * experience.
   *
   * @defaultValue `false`
   */
  isExploringAssetModelAssets?: boolean;
}

/**
 * Table UI component for exploring and selecting IoT SiteWise asset summary
 * resources.
 */
export function AssetTable({
  assets,
  selectedAssets,
  onSelectAsset,
  isAssetDisabled,
  onAssetNameClick,
  isExploringAssetModelAssets = false,
  ...tableProperties
}: AssetTableProps) {
  const tableResourceProperties = useRef<
    ResourceTableProps<AssetSummary>['properties'] | null
  >(null);

  function getTableProperties(): ResourceTableProps<AssetSummary>['properties'] {
    if (!tableResourceProperties.current) {
      const properties = createDefaultAssetTableProperties(
        ({ id, name, hierarchies = [] }) => {
          if (!isExploringAssetModelAssets && hierarchies.length > 0) {
            return <Link onFollow={() => onAssetNameClick(id)}>{name}</Link>;
          } else {
            return name;
          }
        }
      );

      tableResourceProperties.current = properties;
    }

    return tableResourceProperties.current;
  }

  return (
    <ResourceTable<AssetSummary>
      {...tableProperties}
      resourceName='Asset'
      pluralResourceName='Assets'
      properties={getTableProperties()}
      resourceKey={({ id = '' }) => id}
      resources={assets}
      onSelectResource={onSelectAsset}
      selectedResources={selectedAssets}
      isResourceDisabled={isAssetDisabled}
    />
  );
}
