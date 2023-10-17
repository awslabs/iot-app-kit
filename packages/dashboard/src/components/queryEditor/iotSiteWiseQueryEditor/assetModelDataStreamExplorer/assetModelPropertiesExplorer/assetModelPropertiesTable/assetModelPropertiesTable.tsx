import { AssetModelPropertySummary } from '@aws-sdk/client-iotsitewise';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Table from '@cloudscape-design/components/table';
import React from 'react';
import { useExplorerPreferences } from '../../../useExplorerPreferences';
import {
  ASSET_MODEL_PROPERTIES_TABLE_FILTERING_PROPERTIES,
  AssetModelPropertiesTablePropertyFilter,
} from './assetModelPropertiesTableFilter';
import { AssetModelPropertiesTableEmptyState } from './assetModelPropertiesTableEmptyState';
import { AssetModelPropertiesTablePagination } from './assetModelPropertiesTablePagination';
import { AssetModelPropertiesTablePreferences } from './assetModelPropertiesTablePreferences';
import { AssetModelPropertiesTableColumnDefinitionsFactory } from './assetModelPropertiesTableColumnDefinitionsFactory';
import { AssetModelPropertiesTableHeader } from './assetModelPropertiesTableHeader';
import { SelectedAssetModelProperties } from '../../useSelectedAssetModelProperties';
import { useCustomCompareEffect } from 'react-use';
import { isEqual } from 'lodash';

export interface AssetTableProps {
  onClickNextPage: () => void;
  onSelectAssetModelProperties: (assetModelProperty: AssetModelPropertySummary[]) => void;
  assetModelProperties: AssetModelPropertySummary[];
  selectedAssetModelProperties: SelectedAssetModelProperties;
  isLoading: boolean;
  hasNextPage: boolean;
  isWithoutHeader?: boolean;
}

export function AssetModelPropertiesTable({
  assetModelProperties,
  selectedAssetModelProperties,
  onClickNextPage,
  onSelectAssetModelProperties,
  isLoading,
  hasNextPage,
}: AssetTableProps) {
  const [preferences, updatePreferences] = useExplorerPreferences({
    defaultVisibleContent: ['name'],
    resourceName: 'asset model properties',
  });

  const { items, collectionProps, paginationProps, propertyFilterProps, actions } = useCollection(
    assetModelProperties,
    {
      propertyFiltering: {
        filteringProperties: ASSET_MODEL_PROPERTIES_TABLE_FILTERING_PROPERTIES,
      },
      pagination: { pageSize: preferences.pageSize },
      selection: {
        defaultSelectedItems: selectedAssetModelProperties,
        trackBy: ({ id = '' }) => id,
        keepSelection: true,
      },
      sorting: {},
    }
  );

  function handleClickNextPage() {
    onClickNextPage();
  }

  useCustomCompareEffect(
    () => {
      actions.setSelectedItems(selectedAssetModelProperties);
    },
    [selectedAssetModelProperties],
    isEqual
  );

  const columnDefinitionFactory = new AssetModelPropertiesTableColumnDefinitionsFactory();

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columnDefinitionFactory.create()}
      trackBy={({ id = '' }) => id}
      variant='embedded'
      loading={isLoading}
      loadingText='Loading asset model properties...'
      selectionType='multi'
      onSelectionChange={(event) => {
        const selectedAssets = event.detail.selectedItems;
        onSelectAssetModelProperties(selectedAssets);
        // pass event to `useCollection` for synchronization
        if (collectionProps.onSelectionChange) {
          collectionProps.onSelectionChange(event);
        }
      }}
      resizableColumns
      stickyColumns={preferences.stickyColumns}
      stripedRows={preferences.stripedRows}
      visibleColumns={preferences.visibleContent}
      wrapLines={preferences.wrapLines}
      empty={<AssetModelPropertiesTableEmptyState />}
      filter={<AssetModelPropertiesTablePropertyFilter {...propertyFilterProps} />}
      header={
        <AssetModelPropertiesTableHeader
          selectedItemCount={collectionProps.selectedItems?.length}
          totalItemCount={collectionProps.totalItemsCount ?? 0}
        />
      }
      pagination={
        <AssetModelPropertiesTablePagination
          {...paginationProps}
          openEnd={hasNextPage}
          onNextPageClick={handleClickNextPage}
        />
      }
      preferences={
        <AssetModelPropertiesTablePreferences preferences={preferences} updatePreferences={updatePreferences} />
      }
      ariaLabels={{
        itemSelectionLabel: (isNotSelected, assetModelProperty) =>
          isNotSelected
            ? `Select asset model property ${assetModelProperty.name}`
            : `Deselect asset model property ${assetModelProperty.name}`,
      }}
    />
  );
}
