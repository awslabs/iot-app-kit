import type { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useAssetModels } from './use-asset-models';
import { ResourceTable } from '../resource-table/resource-table';
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
  const { assetModels, isLoading, hasNextPage, nextPage } = useAssetModels({
    listAssetModels,
    assetModelTypes,
  });

  return (
    <ResourceTable
      hasNextPage={hasNextPage}
      onNextPageClick={nextPage}
      isLoading={isLoading}
      filterEnabled={filterEnabled}
      selectedResources={selectedResources}
      onSelectionChange={({ detail }) =>
        onSelectionChange && onSelectionChange(detail.selectedItems ?? [])
      }
      preferencesEnabled={preferencesEnabled}
      selectionType={selectionType}
      resources={assetModels}
      schema={{
        name: 'Asset model',
        pluralName: 'Asset models',
        properties: [
          {
            id: 'arn',
            name: 'ARN',
            pluralName: 'ARNs',
            render: ({ arn }) => arn,
            filterOperators: ['!:', ':', '!=', '='],
          },
          {
            id: 'assetModelType',
            name: 'Type',
            pluralName: 'Types',
            render: ({ assetModelType }) => assetModelType,
          },
          {
            id: 'creationDate',
            name: 'Creation date',
            pluralName: 'Creation dates',
            render: ({ creationDate }) => creationDate?.toLocaleDateString(),
          },
          {
            id: 'description',
            name: 'Description',
            pluralName: 'Descriptions',
            render: ({ description }) => description,
          },
          {
            id: 'externalId',
            name: 'External ID',
            pluralName: 'External IDs',
            render: ({ externalId }) => externalId,
          },
          {
            id: 'id',
            name: 'ID',
            pluralName: 'IDs',
            render: ({ id }) => id,
          },
          {
            id: 'lastUpdateDate',
            name: 'Last update date',
            pluralName: 'Last update dates',
            render: ({ lastUpdateDate }) =>
              lastUpdateDate?.toLocaleDateString(),
          },
          {
            id: 'name',
            name: 'Name',
            pluralName: 'Names',
            render: ({ name }) => name,
          },
          {
            id: 'state',
            name: 'State',
            pluralName: 'States',
            render: ({ status: { state = '' } = {} }) => state,
          },
        ],
      }}
    />
  );
}
