import {
  type AssetPropertySummary,
  type AssetProperty,
} from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useAssetProperties } from './use-asset-properties';
import {
  ResourceTable,
  type ResourceTableProps,
} from '../resource-table/resource-table';
import type {
  DescribeAsset,
  ListAssetModelProperties,
  ListAssetProperties,
} from '../types/data-source';
import type { ResourceExplorerProps } from '../types/resource-explorer';

export interface AssetPropertyExplorerDataSource {
  listAssetProperties: ListAssetProperties;
  describeAsset?: DescribeAsset;
  listAssetModelProperties?: ListAssetModelProperties;
}

export interface AssetPropertyExplorerProps
  extends ResourceExplorerProps<AssetPropertySummary | AssetProperty> {
  dataSource: AssetPropertyExplorerDataSource;
  assetIds: string[];
}

type Schema<T> = ResourceTableProps<T>['schema'];
type SchemaProperties<T> = Schema<T>['properties'];

function createMinimalSchema(): Schema<AssetPropertySummary> {
  const commonProperties: SchemaProperties<AssetPropertySummary> = [
    {
      id: 'name',
      name: 'Name',
      pluralName: 'Names',
      // name of the asset property is on the last path
      render: (resource) => resource.path?.at(-1)?.name,
      filterOperators: ['!:', ':', '!=', '='],
    },
    {
      id: 'unit',
      name: 'Unit',
      pluralName: 'Units',
      render: (resource) => resource.unit ?? '-',
      filterOperators: ['!:', ':', '!=', '='],
    },
    {
      id: 'assetName',
      name: 'Asset name',
      pluralName: 'Asset names',
      // name of the asset is on the first path
      render: (resource) => resource.path?.at(0)?.name,
      filterOperators: ['!:', ':', '!=', '='],
    },
  ];

  const schema = {
    name: 'Asset property',
    pluralName: 'Asset properties',
    properties: commonProperties,
  };

  return schema;
}

function createExtendedSchema(): Schema<AssetProperty> {
  const minimalSchema = createMinimalSchema();
  const extendedProperties: SchemaProperties<AssetProperty> = [
    {
      id: 'dataType',
      name: 'Data type',
      pluralName: 'Data types',
      render: (resource) => resource.dataType,
      filterOperators: ['!:', ':', '!=', '='],
    },
  ];

  const extendedSchema = {
    ...minimalSchema,
    properties: [...minimalSchema.properties, ...extendedProperties],
  };

  return extendedSchema;
}

function isExtended<DS extends AssetPropertyExplorerDataSource>(
  ds: DS
): ds is DS & {
  describeAsset: DescribeAsset;
  listAssetModelProperties: ListAssetModelProperties;
} {
  return ds.describeAsset != null && ds.listAssetModelProperties != null;
}

/**
 * Explore AWS IoT SiteWise asset properties.
 *
 * @experimental
 */
export function AssetPropertyExplorer({
  assetIds,
  onSelectionChange,
  dataSource,
}: AssetPropertyExplorerProps) {
  const { assetProperties } = useAssetProperties({
    assetIds,
    listAssetProperties: dataSource.listAssetProperties,
    describeAsset: dataSource.describeAsset,
    listAssetModelProperties: dataSource.listAssetModelProperties,
  });

  if (isExtended(dataSource)) {
    return (
      <ResourceTable<AssetProperty>
        resources={assetProperties as AssetProperty[]}
        onSelectionChange={
          onSelectionChange != null
            ? ({ detail }) => onSelectionChange(detail.selectedItems)
            : undefined
        }
        schema={createExtendedSchema()}
      />
    );
  }

  return (
    <ResourceTable<AssetPropertySummary>
      resources={assetProperties}
      onSelectionChange={
        onSelectionChange != null
          ? ({ detail }) => onSelectionChange(detail.selectedItems)
          : undefined
      }
      schema={createMinimalSchema()}
    />
  );
}
