import React from 'react';
import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Pagination from '@cloudscape-design/components/pagination';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';

import type { UnmodeledDataStream } from '../types';
import { useExplorerPreferences } from '../../useExplorerPreferences';
import { SUPPORTED_PAGE_SIZES } from '../../constants';
import { useLatestValues } from '../../useLatestValues';

export interface UnmodeledDataStreamTableProps {
  onClickAdd: (unmodeledDataStreams: UnmodeledDataStream[]) => void;
  unmodeledDataStreams: UnmodeledDataStream[];
  isLoading: boolean;
  client: IoTSiteWiseClient;
  hasNextPage: boolean;
}

export function UnmodeledDataStreamTable({
  onClickAdd,
  unmodeledDataStreams,
  isLoading,
  client,
  hasNextPage,
}: UnmodeledDataStreamTableProps) {
  const [preferences, setPreferences] = useExplorerPreferences({
    defaultVisibleContent: ['propertyAlias', 'latestValue'],
    resourceName: 'unmodeled data stream',
  });

  const { getLatestValue } = useLatestValues({
    isEnabled:
      preferences.visibleContent.includes('latestValue') || preferences.visibleContent.includes('latestValueTime'),
    dataStreams: unmodeledDataStreams,
    client,
  });

  const unmodeledDataStreamsWithLatestValues =
    unmodeledDataStreams?.map((item) => ({
      ...item,
      latestValue: getLatestValue(item)?.value,
      latestValueTime: getLatestValue(item)?.timestamp,
    })) ?? [];

  const { items, collectionProps, paginationProps, propertyFilterProps, actions } = useCollection(
    unmodeledDataStreamsWithLatestValues,
    {
      propertyFiltering: {
        filteringProperties: [
          {
            key: 'propertyAlias',
            propertyLabel: 'Alias',
            groupValuesLabel: 'Property aliases',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'dataType',
            propertyLabel: 'Data type',
            groupValuesLabel: 'Data types',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'dataTypeSpec',
            propertyLabel: 'Data type spec',
            groupValuesLabel: 'Data type specs',
            operators: ['=', '!=', ':', '!:'],
          },
          {
            key: 'latestValue',
            propertyLabel: 'Latest value',
            groupValuesLabel: 'Latest values',
            operators: ['=', '!=', '>', '>=', '<', '<='],
          },
        ],
      },
      pagination: { pageSize: preferences.pageSize },
      selection: { keepSelection: true, trackBy: 'propertyAlias' },
      sorting: {},
    }
  );

  return (
    <Table
      {...collectionProps}
      items={items}
      header={
        <Header
          variant='h3'
          counter={
            collectionProps.selectedItems?.length
              ? `(${collectionProps.selectedItems.length}/${collectionProps.totalItemsCount})`
              : `(${collectionProps.totalItemsCount})`
          }
        >
          Unmodeled data streams
        </Header>
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
              onClick={() => onClickAdd(collectionProps.selectedItems as unknown as UnmodeledDataStream[])}
            >
              Add
            </Button>
          </SpaceBetween>
        </Box>
      }
      resizableColumns
      columnDefinitions={[
        {
          id: 'propertyAlias',
          header: 'Alias',
          cell: ({ propertyAlias }) => propertyAlias,
          sortingField: 'propertyAlias',
        },
        {
          id: 'latestValue',
          header: 'Latest value',
          cell: ({ latestValue }) => latestValue,
          sortingField: 'latestValue',
        },
        {
          id: 'latestValueTime',
          header: 'Latest value time',
          cell: ({ latestValueTime }) => latestValueTime,
          sortingField: 'latestValueTime',
        },
        {
          id: 'dataType',
          header: 'Data type',
          cell: ({ dataType }) => dataType,
          sortingField: 'dataType',
        },
        {
          id: 'dataTypeSpec',
          header: 'Data type spec',
          cell: ({ dataTypeSpec }) => dataTypeSpec,
          sortingField: 'dataTypeSpec',
        },
      ]}
      variant='embedded'
      loading={isLoading}
      loadingText='Loading unmodeled data streams...'
      stickyColumns={preferences.stickyColumns}
      selectionType='multi'
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No unmodeled data streams.</b>
        </Box>
      }
      pagination={
        <Pagination
          {...paginationProps}
          openEnd={hasNextPage}
          ariaLabels={{
            nextPageLabel: 'Next page',
            paginationLabel: 'Table pagination',
            previousPageLabel: 'Previous page',
            pageLabel: (pageNumber) => `Page ${pageNumber}`,
          }}
        />
      }
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          filteringLoadingText='Loading suggestions'
          filteringErrorText='Error fetching suggestions.'
          filteringRecoveryText='Retry'
          filteringFinishedText='End of results'
          filteringEmpty='No suggestions found'
          i18nStrings={{
            filteringAriaLabel: 'your choice',
            dismissAriaLabel: 'Dismiss',
            filteringPlaceholder: 'Filter unmodeled data streams by text, property, or value',
            groupValuesText: 'Values',
            groupPropertiesText: 'Properties',
            operatorsText: 'Operators',
            operationAndText: 'and',
            operationOrText: 'or',
            operatorLessText: 'Less than',
            operatorLessOrEqualText: 'Less than or equal',
            operatorGreaterText: 'Greater than',
            operatorGreaterOrEqualText: 'Greater than or equal',
            operatorContainsText: 'Contains',
            operatorDoesNotContainText: 'Does not contain',
            operatorEqualsText: 'Equals',
            operatorDoesNotEqualText: 'Does not equal',
            editTokenHeader: 'Edit filter',
            propertyText: 'Property',
            operatorText: 'Operator',
            valueText: 'Value',
            cancelActionText: 'Cancel',
            applyActionText: 'Apply',
            allPropertiesLabel: 'All properties',
            tokenLimitShowMore: 'Show more',
            tokenLimitShowFewer: 'Show fewer',
            clearFiltersText: 'Clear filters',
            removeTokenButtonAriaLabel: (token) => `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
            enteredTextLabel: (text) => `Use: "${text}"`,
          }}
        />
      }
      visibleColumns={preferences.visibleContent}
      stripedRows={preferences.stripedRows}
      wrapLines={preferences.wrapLines}
      preferences={
        <CollectionPreferences
          title='Unmodeled data stream preferences'
          confirmLabel='Confirm'
          cancelLabel='Cancel'
          preferences={preferences}
          onConfirm={({ detail }) => {
            setPreferences(detail as typeof preferences);
          }}
          pageSizePreference={{
            title: 'Select page size',
            options: SUPPORTED_PAGE_SIZES.map((size) => ({ value: size, label: size.toString() })),
          }}
          wrapLinesPreference={{
            label: 'Wrap lines',
            description: 'Select to see all the text and wrap the lines',
          }}
          stripedRowsPreference={{
            label: 'Striped rows',
            description: 'Select to add alternating shaded rows',
          }}
          visibleContentPreference={{
            title: 'Select visible content',
            options: [
              {
                label: `Unmodeled data stream fields`,
                options: [
                  { id: 'propertyAlias', label: 'Alias' },
                  { id: 'latestValue', label: 'Latest values' },
                  { id: 'latestValueTime', label: 'Latest value times' },
                  { id: 'dataType', label: 'Data type' },
                  { id: 'dataTypeSpec', label: 'Data type spec' },
                ],
              },
            ],
          }}
        />
      }
    />
  );
}
