import React from 'react';
import { useSelector } from 'react-redux';
import { isFunction } from 'lodash';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Table from '@cloudscape-design/components/table';

import { useLatestValues } from '../../../useLatestValues';
import { useExplorerPreferences } from '../../../useExplorerPreferences';
import { ModeledDataStreamTableEmptyState } from './modeledDataStreamTableEmptyState';
import { createModeledDataStreamColumnDefinitions } from './createModeledDataStreamColumnDefinitions';
import {
  ModeledDataStreamTablePropertyFilter,
  MODELED_DATA_STREAM_TABLE_FILTERING_PROPERTIES,
} from './modeledDataStreamTablePropertyFilter';
import { ModeledDataStreamTablePreferences } from './modeledDataStreamTablePreferences';
import { ModeledDataStreamTablePagination } from './modeledDataStreamTablePagination';
import { ModeledDataStreamTableHeader } from './modeledDataStreamTableHeader';
import type { ModeledDataStream } from '../types';
import { DashboardState } from '~/store/state';
import { ResourceExplorerFooter } from '../../../footer/footer';
import { SelectedAsset } from '../../types';
import { ResourceExplorerErrorState } from '../../components/resourceExplorerErrorState';

export interface ModeledDataStreamTableProps {
  onClickAddModeledDataStreams: (modeledDataStreams: ModeledDataStream[]) => void;
  onClickNextPage?: () => void;
  selectedAsset?: SelectedAsset;
  modeledDataStreams: ModeledDataStream[];
  isLoading: boolean;
  isError: boolean;
  client: IoTSiteWiseClient;
  hasNextPage?: boolean;
  modeledDataStreamsTitle?: string;
}

export function ModeledDataStreamTable({
  onClickAddModeledDataStreams,
  onClickNextPage,
  selectedAsset,
  modeledDataStreams,
  isLoading,
  isError,
  client,
  hasNextPage,
  modeledDataStreamsTitle,
}: ModeledDataStreamTableProps) {
  const significantDigits = useSelector((state: DashboardState) => state.significantDigits);
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);

  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ['name', 'latestValue'],
    resourceName: 'modeled data stream',
  });

  const { getLatestValue } = useLatestValues({
    isEnabled:
      preferences.visibleContent.includes('latestValue') || preferences.visibleContent.includes('latestValueTime'),
    dataStreams: modeledDataStreams,
    client,
  });

  const modeledDataStreamsWithLatestValues =
    modeledDataStreams?.map((item) => ({
      ...item,
      latestValue: getLatestValue({ assetId: item.assetId, propertyId: item.propertyId } as ModeledDataStream)?.value,
      latestValueTime: getLatestValue({ assetId: item.assetId, propertyId: item.propertyId } as ModeledDataStream)
        ?.timestamp,
    })) ?? [];

  const { items, collectionProps, paginationProps, propertyFilterProps, actions } = useCollection(
    modeledDataStreamsWithLatestValues,
    {
      propertyFiltering: {
        filteringProperties: MODELED_DATA_STREAM_TABLE_FILTERING_PROPERTIES,
      },
      pagination: { pageSize: preferences.pageSize },
      selection: { keepSelection: true, trackBy: 'name' },
      sorting: {},
    }
  );

  const handleClickNextPage = () => {
    if (isFunction(onClickNextPage)) {
      onClickNextPage();
    }
  };

  const paginationPropsWithAriaLabels = {
    ...paginationProps,
    openEnd: hasNextPage,
    ariaLabels: {
      nextPageLabel: 'Next page',
      paginationLabel: 'Modeled DataStream Table pagination',
      previousPageLabel: 'Previous page',
      pageLabel: (pageNumber: number) => `Page ${pageNumber}`,
    },
  };

  if (isError) {
    return <ResourceExplorerErrorState title={modeledDataStreamsTitle} />;
  }

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={createModeledDataStreamColumnDefinitions(significantDigits)}
      trackBy={(item) => `${item.assetId}---${item.propertyId}`}
      variant='embedded'
      loading={isLoading}
      loadingText='Loading modeled data streams...'
      selectionType='multi'
      resizableColumns
      visibleColumns={preferences.visibleContent}
      stripedRows={preferences.stripedRows}
      wrapLines={preferences.wrapLines}
      stickyColumns={preferences.stickyColumns}
      empty={<ModeledDataStreamTableEmptyState isAssetSelected={selectedAsset != null} />}
      filter={<ModeledDataStreamTablePropertyFilter {...propertyFilterProps} />}
      header={
        <ModeledDataStreamTableHeader
          selectedItemCount={collectionProps.selectedItems?.length}
          totalItemCount={collectionProps.totalItemsCount ?? 0}
        />
      }
      footer={
        <ResourceExplorerFooter
          resetDisabled={collectionProps.selectedItems?.length === 0}
          onReset={() => actions.setSelectedItems([])}
          addDisabled={collectionProps.selectedItems?.length === 0 || selectedWidgets.length !== 1}
          onAdd={() => {
            onClickAddModeledDataStreams(collectionProps.selectedItems as unknown as ModeledDataStream[]);
          }}
        />
      }
      pagination={
        <ModeledDataStreamTablePagination {...paginationPropsWithAriaLabels} onNextPageClick={handleClickNextPage} />
      }
      preferences={<ModeledDataStreamTablePreferences preferences={preferences} updatePreferences={setPreferences} />}
      ariaLabels={{
        itemSelectionLabel: (isNotSelected, modeledDataStream) =>
          isNotSelected
            ? `Select modeled data stream ${modeledDataStream.name}`
            : `Deselect modeled data stream ${modeledDataStream.name}`,

        allItemsSelectionLabel: (isNotSelected) =>
          isNotSelected ? `Select modeled data stream` : `Deselect modeled data stream`,
      }}
    />
  );
}
