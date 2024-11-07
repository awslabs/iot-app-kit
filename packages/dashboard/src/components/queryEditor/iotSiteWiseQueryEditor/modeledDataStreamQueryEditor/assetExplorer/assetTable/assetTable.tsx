import {
  type AssetSummary,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Table from '@cloudscape-design/components/table';
import { useSelector } from 'react-redux';
import { type DashboardState } from '~/store/state';

import { AssetTableEmptyState } from './assetTableEmptyState';
import { AssetTableHeader } from './assetTableHeader';
import { AssetTablePagination } from './assetTablePagination';
import { AssetTablePreferences } from './assetTablePreferences';
import {
  AssetTablePropertyFilter,
  ASSET_TABLE_FILTERING_PROPERTIES,
} from './assetTablePropertyFilter';
import { AssetTableColumnDefinitionsFactory } from './assetTableColumnDefinitionsFactory';
import { AssetTableNameLink } from './assetTableNameLink';
import { AssetTableHierarchyPath } from './assetTableHierarchyPath';
import { useExplorerPreferences } from '../../../useExplorerPreferences';
import { ResourceExplorerErrorState } from '../../components/resourceExplorerErrorState';

export interface AssetTableProps {
  parentAssetId?: string;
  onClickAsset: (parentAssetId?: string) => void;
  onClickNextPage: () => void;
  onSelectAsset: (asset?: AssetSummary) => void;
  assets: AssetSummary[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isWithoutHeader?: boolean;
  client: IoTSiteWiseClient;
}

export function AssetTable({
  parentAssetId,
  assets,
  onClickAsset,
  onClickNextPage,
  onSelectAsset,
  isLoading,
  isError,
  hasNextPage,
  isWithoutHeader,
  client,
}: AssetTableProps) {
  const [preferences, updatePreferences] = useExplorerPreferences({
    defaultVisibleContent: ['name'],
    resourceName: 'asset',
  });

  const {
    items,
    collectionProps,
    paginationProps,
    propertyFilterProps,
    actions,
  } = useCollection(assets, {
    propertyFiltering: {
      filteringProperties: ASSET_TABLE_FILTERING_PROPERTIES,
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {
      keepSelection: false,
    },
    sorting: {},
  });

  const timeZone = useSelector((state: DashboardState) => state.timeZone);

  function handleClickAsset(parentAssetId?: string) {
    actions.setSelectedItems([]);
    onSelectAsset(undefined);
    onClickAsset(parentAssetId);
  }

  function handleClickPreviousPage() {
    actions.setSelectedItems([]);
    onSelectAsset(undefined);
  }

  function handleClickNextPage() {
    actions.setSelectedItems([]);
    onSelectAsset(undefined);
    onClickNextPage();
  }

  function handleClickBreadCrumb(parentAssetId?: string) {
    onSelectAsset(undefined);
    onClickAsset(parentAssetId);
  }

  const columnDefinitionFactory = new AssetTableColumnDefinitionsFactory({
    NameLink: AssetTableNameLink,
    onClickNameLink: handleClickAsset,
    timeZone,
  });

  if (isError) {
    return <ResourceExplorerErrorState title='Browse assets (0)' />;
  }

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={columnDefinitionFactory.create()}
      trackBy={({ id = '' }) => id}
      variant='embedded'
      loading={isLoading}
      loadingText='Loading assets...'
      selectionType='single'
      onSelectionChange={(event) => {
        const selectedAsset = event.detail.selectedItems.at(0);
        onSelectAsset(selectedAsset);

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
      empty={<AssetTableEmptyState />}
      filter={<AssetTablePropertyFilter {...propertyFilterProps} />}
      header={
        <>
          {!isWithoutHeader && (
            <AssetTableHeader
              selectedItemCount={collectionProps.selectedItems?.length}
              totalItemCount={collectionProps.totalItemsCount ?? 0}
            />
          )}
          <AssetTableHierarchyPath
            client={client}
            parentAssetId={parentAssetId}
            onClickAssetName={handleClickBreadCrumb}
          />
        </>
      }
      pagination={
        <AssetTablePagination
          {...paginationProps}
          openEnd={hasNextPage && parentAssetId == null}
          onPreviousPageClick={handleClickPreviousPage}
          onNextPageClick={handleClickNextPage}
        />
      }
      preferences={
        <AssetTablePreferences
          preferences={preferences}
          updatePreferences={updatePreferences}
        />
      }
      ariaLabels={{
        resizerRoleDescription: 'Resize button',
        itemSelectionLabel: (isNotSelected, asset) =>
          isNotSelected
            ? `Select asset ${asset.name}`
            : `Deselect asset ${asset.name}`,
      }}
    />
  );
}
