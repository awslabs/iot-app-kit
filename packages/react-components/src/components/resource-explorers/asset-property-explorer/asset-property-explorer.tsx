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
import { useResourceTablePreferences } from '../resource-table/use-resource-table-preferences';

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
  preferencesEnabled,
  filterEnabled,
}: AssetPropertyExplorerProps) {
  const [preferences, setPreferences] = useResourceTablePreferences({
    schema:
      dataSource.listAssetModelProperties != null
        ? createExtendedSchema()
        : createMinimalSchema(),
  });

  const { assetProperties, isLoading } = useAssetProperties({
    assetIds,
    listAssetProperties: dataSource.listAssetProperties,
    describeAsset: dataSource.describeAsset,
    listAssetModelProperties: dataSource.listAssetModelProperties,
    pageSize: 5,
  });

  console.log(isLoading);

  if (isExtended(dataSource)) {
    return (
      <ResourceTable<AssetProperty>
        isLoading={isLoading}
        preferences={preferences}
        setPreferences={setPreferences}
        preferencesEnabled={preferencesEnabled}
        filterEnabled={filterEnabled}
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
      isLoading={isLoading}
      preferences={preferences}
      setPreferences={setPreferences}
      preferencesEnabled={preferencesEnabled}
      filterEnabled={filterEnabled}
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
