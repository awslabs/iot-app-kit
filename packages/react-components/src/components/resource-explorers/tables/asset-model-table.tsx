import type { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { ResourceTable } from './resource-table';
import type { ConcreteResourceTableProps } from './types';
import type { AssetModelName } from '../types/resource';
import { DEFAULT_ASSET_MODEL_TABLE_PROPERTIES } from '../constants/defaults/table-properties';

export type AssetModelTableProps = ConcreteResourceTableProps<
  AssetModelSummary,
  AssetModelName
>;

/**
 * Table UI component for exploring and selecting IoT SiteWise asset model
 * summary resources.
 */
export function AssetModelTable({
  assetModels,
  selectedAssetModels,
  onSelectAssetModel,
  isAssetModelDisabled,
  ...tableProperties
}: AssetModelTableProps) {
  return (
    <ResourceTable<AssetModelSummary>
      {...tableProperties}
      resourceName='Asset model'
      pluralResourceName='Asset models'
      properties={DEFAULT_ASSET_MODEL_TABLE_PROPERTIES}
      resourceKey={({ id = '' }) => id}
      resources={assetModels}
      selectedResources={selectedAssetModels}
      onSelectResource={onSelectAssetModel}
      isResourceDisabled={isAssetModelDisabled}
    />
  );
}
