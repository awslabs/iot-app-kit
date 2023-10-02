import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '@cloudscape-design/components/button';
import Table from '@cloudscape-design/components/table';
import React from 'react';

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
import { Box, SpaceBetween } from '@cloudscape-design/components';

export interface ModeledDataStreamTableProps {
  onClickAddModeledDataStreams: (modeledDataStreams: ModeledDataStream[]) => void;
  selectedAssetId?: string;
  modeledDataStreams: ModeledDataStream[];
  isLoading: boolean;
  client: IoTSiteWiseClient;
}

export function ModeledDataStreamTable({
  onClickAddModeledDataStreams,
  selectedAssetId,
  modeledDataStreams,
  isLoading,
  client,
}: ModeledDataStreamTableProps) {
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

  const { items, collectionProps, paginationProps, propertyFilterProps, actions } = useCollection(modeledDataStreams, {
    propertyFiltering: {
      filteringProperties: MODELED_DATA_STREAM_TABLE_FILTERING_PROPERTIES,
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {},
    sorting: {},
  });

  return (
    <Table
      {...collectionProps}
      items={items}
      columnDefinitions={createModeledDataStreamColumnDefinitions(getLatestValue)}
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
      empty={<ModeledDataStreamTableEmptyState isAssetSelected={selectedAssetId != null} />}
      filter={<ModeledDataStreamTablePropertyFilter {...propertyFilterProps} />}
      header={
        <ModeledDataStreamTableHeader
          selectedItemCount={collectionProps.selectedItems?.length}
          totalItemCount={collectionProps.totalItemsCount ?? 0}
        />
      }
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button disabled={collectionProps.selectedItems?.length === 0} onClick={() => actions.setSelectedItems([])}>
              Reset
            </Button>
            <Button
              variant='primary'
              disabled={collectionProps.selectedItems?.length === 0}
              onClick={() => {
                onClickAddModeledDataStreams(collectionProps.selectedItems as unknown as ModeledDataStream[]);
              }}
            >
              Add
            </Button>
          </SpaceBetween>
        </Box>
      }
      pagination={<ModeledDataStreamTablePagination {...paginationProps} />}
      preferences={<ModeledDataStreamTablePreferences preferences={preferences} updatePreferences={setPreferences} />}
      ariaLabels={{
        itemSelectionLabel: (isNotSelected, modeledDataStream) =>
          isNotSelected
            ? `Select modeled data stream ${modeledDataStream.name}`
            : `Deselect modeled data stream ${modeledDataStream.name}`,
      }}
    />
  );
}