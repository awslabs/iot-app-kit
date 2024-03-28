import { useCollection } from '@cloudscape-design/collection-hooks';
import Box from '@cloudscape-design/components/box';
import Table, { type TableProps } from '@cloudscape-design/components/table';
import Pagination, {
  type PaginationProps,
} from '@cloudscape-design/components/pagination';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import React, { useMemo } from 'react';
import { type CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';

import { Header, PropertyFilter } from '@cloudscape-design/components';
import type { ResourceSchema } from './types';
import { deriveSchema } from './schema';

type SelectionType = TableProps['selectionType'];
type OnSelectionChange = TableProps['onSelectionChange'];

type ResourceTablePreferences = NonNullable<
  CollectionPreferencesProps['preferences']
>;
type SetResourceTablePreferences = (
  preferences: ResourceTablePreferences
) => void;

export interface ResourceTableProps<Resource> {
  readonly resources: Resource[];
  schema: ResourceSchema<Resource>;
  selectionType?: SelectionType;
  onSelectionChange?: OnSelectionChange;
  isLoading?: boolean;
  trackBy?: TableProps['trackBy'];
  ariaLabels?: TableProps['ariaLabels'] & PaginationProps['ariaLabels'];
  selectedResources?: Resource[];
  isResourceDisabled?: (resource: Resource) => boolean;
  preferencesEnabled?: boolean;
  filterEnabled?: boolean;
  extendedHeader?: React.ReactNode;
  onNextPageClick?: () => void;
  hasNextPage?: boolean;
  preferences?: ResourceTablePreferences;
  setPreferences?: SetResourceTablePreferences;
}

export const SUPPORTED_PAGE_SIZES = [10, 25, 100, 250];

export function ResourceTable<Resource>({
  resources,
  schema,
  selectionType = undefined,
  onSelectionChange,
  isLoading = false,
  trackBy,
  ariaLabels,
  selectedResources,
  isResourceDisabled,
  preferencesEnabled = false,
  filterEnabled = false,
  extendedHeader,
  onNextPageClick,
  hasNextPage,
  preferences = {},
  setPreferences,
}: ResourceTableProps<Resource>) {
  const {
    columnDefinitions,
    filteringProperties,
    contentDisplayPreferenceOptions,
  } = useMemo(() => deriveSchema(schema), []);

  const { collectionProps, items, paginationProps, propertyFilterProps } =
    useCollection(resources, {
      propertyFiltering: { filteringProperties },
      pagination: { pageSize: preferences.pageSize },
      selection: { keepSelection: true },
      sorting: {},
    });

  return (
    <Table<Resource>
      {...collectionProps}
      isItemDisabled={isResourceDisabled}
      variant='embedded'
      stickyColumns={preferences.stickyColumns}
      wrapLines={preferences.wrapLines}
      stripedRows={preferences.stripedRows}
      columnDisplay={preferences.contentDisplay}
      contentDensity={preferences.contentDensity}
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No {schema.pluralName.toLowerCase()}.</b>
        </Box>
      }
      items={items}
      header={
        <>
          <Header
            variant='h3'
            counter={
              collectionProps.selectedItems?.length
                ? `(${collectionProps.selectedItems.length}/${collectionProps.totalItemsCount})`
                : `(${collectionProps.totalItemsCount})`
            }
          >
            {schema.pluralName}
          </Header>
          {extendedHeader}
        </>
      }
      columnDefinitions={columnDefinitions}
      selectionType={selectionType}
      onSelectionChange={onSelectionChange}
      selectedItems={selectedResources}
      loading={isLoading}
      loadingText={`Loading ${schema.pluralName.toLowerCase()}...`}
      trackBy={trackBy}
      ariaLabels={ariaLabels}
      pagination={
        <Pagination
          {...paginationProps}
          // TODO: openEnd
          ariaLabels={ariaLabels}
          // We don't want to fire pagination request unless on the last page
          onNextPageClick={
            hasNextPage &&
            paginationProps.currentPageIndex === paginationProps.pagesCount
              ? onNextPageClick
              : undefined
          }
          openEnd={hasNextPage}
        />
      }
      preferences={
        preferencesEnabled ? (
          <CollectionPreferences
            title={`${schema.name} preferences`}
            confirmLabel='Confirm'
            cancelLabel='Cancel'
            preferences={preferences}
            onConfirm={({ detail }) => {
              setPreferences && setPreferences(detail as typeof preferences);
            }}
            contentDensityPreference={{
              label: 'Content density',
              description: 'Select content densisty',
            }}
            pageSizePreference={{
              title: 'Select page size',
              options: SUPPORTED_PAGE_SIZES.map((size) => ({
                value: size,
                label: `${size.toString()} ${schema.pluralName.toLocaleLowerCase()}`,
              })),
            }}
            wrapLinesPreference={{
              label: 'Wrap lines',
              description: 'Select to see all the text and wrap the lines',
            }}
            // TODO: Sticky column preference
            stripedRowsPreference={{
              label: 'Striped rows',
              description: 'Select to add alternating shaded rows',
            }}
            contentDisplayPreference={{
              options: contentDisplayPreferenceOptions,
            }}
          />
        ) : null
      }
      filter={
        filterEnabled ? (
          <PropertyFilter
            {...propertyFilterProps}
            filteringLoadingText='Loading suggestions'
            filteringErrorText='Error fetching suggestions.'
            filteringRecoveryText='Retry'
            filteringFinishedText='End of results'
            filteringEmpty='No suggestions found'
            i18nStrings={{
              filteringAriaLabel:
                'Filter unmodeled data streams by text, property, or value',
              dismissAriaLabel: 'Dismiss',
              filteringPlaceholder:
                'Filter unmodeled data streams by text, property, or value',
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
              removeTokenButtonAriaLabel: (token) =>
                `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
              enteredTextLabel: (text) => `Use: "${text}"`,
            }}
          />
        ) : null
      }
    />
  );
}
