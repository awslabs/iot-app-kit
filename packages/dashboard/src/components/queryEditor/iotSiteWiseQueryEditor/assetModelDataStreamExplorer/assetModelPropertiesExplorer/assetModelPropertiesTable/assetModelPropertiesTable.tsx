import type { AssetModelPropertySummary } from '@aws-sdk/client-iotsitewise';
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
import { ResourceExplorerFooter } from '../../../footer/footer';

import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { isModeledPropertyInvalid } from '~/components/queryEditor/helpers/isModeledPropertyInvalid';
import { disableAdd } from '~/components/queryEditor/iotSiteWiseQueryEditor/footer/disableAdd';

export interface AssetTableProps {
  onClickNextPage: () => void;
  onSelectAssetModelProperties: (
    assetModelProperty: AssetModelPropertySummary[]
  ) => void;
  assetModelProperties: AssetModelPropertySummary[];
  selectedAssetModelProperties: SelectedAssetModelProperties;
  isLoading: boolean;
  hasNextPage: boolean;
  isWithoutHeader?: boolean;
  onSave?: () => void;
  saveDisabled?: boolean;
  isError: boolean;
  retry: () => void;
}

export function AssetModelPropertiesTable({
  assetModelProperties,
  selectedAssetModelProperties,
  onClickNextPage,
  onSelectAssetModelProperties,
  isLoading,
  hasNextPage,
  onSave,
  saveDisabled,
  isError,
  retry,
}: AssetTableProps) {
  const [preferences, updatePreferences] = useExplorerPreferences({
    defaultVisibleContent: ['name'],
    resourceName: 'asset model properties',
  });

  const selectedWidgets = useSelector(
    (state: DashboardState) => state.selectedWidgets
  );

  const {
    items,
    collectionProps,
    paginationProps,
    propertyFilterProps,
    actions,
  } = useCollection(assetModelProperties, {
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
  });

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

  const columnDefinitionFactory =
    new AssetModelPropertiesTableColumnDefinitionsFactory();

  return (
    <Table
      {...collectionProps}
      /**
       * retry button is part of the empty table state
       * cloudscape doesn't have any native configuration option for
       * triggering retries
       */
      items={isError ? [] : items}
      columnDefinitions={columnDefinitionFactory.create()}
      trackBy={({ id = '' }) => id}
      variant='embedded'
      loading={isLoading}
      loadingText='Loading asset model properties...'
      selectionType='multi'
      isItemDisabled={(item) =>
        isModeledPropertyInvalid(item.dataType, selectedWidgets?.at(0)?.type)
      }
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
      empty={
        <AssetModelPropertiesTableEmptyState isError={isError} retry={retry} />
      }
      filter={
        <AssetModelPropertiesTablePropertyFilter {...propertyFilterProps} />
      }
      footer={
        <ResourceExplorerFooter
          addDisabled={
            saveDisabled ||
            disableAdd(selectedWidgets, collectionProps.selectedItems?.length)
          }
          onAdd={onSave}
          onReset={() => actions.setSelectedItems([])}
          resetDisabled={collectionProps.selectedItems?.length === 0}
        />
      }
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
        <AssetModelPropertiesTablePreferences
          preferences={preferences}
          updatePreferences={updatePreferences}
        />
      }
      ariaLabels={{
        resizerRoleDescription: 'Resize button',
        itemSelectionLabel: (isNotSelected, assetModelProperty) =>
          isNotSelected
            ? `Select asset model property ${assetModelProperty.name}`
            : `Deselect asset model property ${assetModelProperty.name}`,
      }}
    />
  );
}
