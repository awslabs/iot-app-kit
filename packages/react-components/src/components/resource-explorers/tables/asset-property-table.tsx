import type { AssetProperty } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { ResourceTable } from './resource-table';
import type { ConcreteResourceTableProps } from './types';
import type { AssetPropertyName } from '../types/resource';
import { DEFAULT_ASSET_PROPERTY_TABLE_PROPERTIES } from '../constants/defaults/table-properties';

export type AssetPropertyTableProps = ConcreteResourceTableProps<
  AssetProperty,
  AssetPropertyName
>;

/**
 * Table UI component for exploring and selecting IoT SiteWise asset property
 * resources.
 */
export function AssetPropertyTable({
  assetProperties,
  selectedAssetProperties,
  onSelectAssetProperty,
  isAssetPropertyDisabled,
  ...tableProperties
}: AssetPropertyTableProps) {
  return (
    <ResourceTable<AssetProperty>
      {...tableProperties}
      resourceName='Asset property'
      pluralResourceName='Asset properties'
      properties={DEFAULT_ASSET_PROPERTY_TABLE_PROPERTIES}
      resourceKey={({ id = '' }) => id}
      resources={assetProperties}
      onSelectResource={onSelectAssetProperty}
      selectedResources={selectedAssetProperties}
      isResourceDisabled={isAssetPropertyDisabled}
    />
  );
}
