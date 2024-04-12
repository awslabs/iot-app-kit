import Alert from '@cloudscape-design/components/alert';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { useCollection as useCloudscapeCollection } from '@cloudscape-design/collection-hooks';
import CloudscapeTable, {
  type TableProps as CloudScapeTableProps,
} from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import React from 'react';
import { StringKey } from '../types/helpers';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import { UserSettings } from '../use-settings';
import { FilterOperator } from '../types/resource-table';

export const SUPPORTED_PAGE_SIZES = [10, 25, 100, 250];

interface Column<Row> {
  id: StringKey<Row>;
  name: string;
  pluralName: string;
  render: (row: Row) => string | React.ReactNode;
  filterOperators?: FilterOperator[];
}

export interface TableProps<Row> {
  rowName: string;
  pluralRowName: string;
  columns: Column<Row>[];
  rows: Row[];
  error?: Error | null;
  renderHeader?: ({
    selectedRowCount,
    totalRowCount,
  }: {
    selectedRowCount: number;
    totalRowCount: number;
  }) => React.ReactNode;
  isRowDisabled?: (row: Row) => boolean;
  hasNextPage?: boolean;
  rowKey: (row: Row) => string;
  selectedRows?: readonly Row[];
  isLoading?: boolean;
  selectionType?: 'single' | 'multi';
  isFilterEnabled?: boolean;
  isUserSettingsEnabled?: boolean;
  userSettings: Required<UserSettings<Row>>;
  onClickNextPage: () => void;
  onUpdateUserSettings: (userSettings: UserSettings<Row>) => void;
  onSelectRow?: (rows: Row[]) => void;
}

export function Table<Row>({
  rowName,
  pluralRowName,
  columns,
  rows,
  error,
  renderHeader,
  isRowDisabled,
  onClickNextPage,
  hasNextPage,
  rowKey,
  selectedRows,
  isLoading,
  selectionType,
  isFilterEnabled,
  isUserSettingsEnabled,
  userSettings,
  onUpdateUserSettings,
  onSelectRow,
}: TableProps<Row>) {
  const { collectionProps, items, paginationProps, propertyFilterProps } =
    useCloudscapeCollection<Row>(rows, {
      propertyFiltering: {
        filteringProperties: columns
          .filter(({ filterOperators = [] }) => filterOperators.length > 0)
          .map(
            ({
              id: key,
              name: propertyLabel,
              pluralName: groupValuesLabel,
            }) => ({
              key,
              propertyLabel,
              groupValuesLabel,
            })
          ),
      },
      pagination: { pageSize: userSettings.pageSize },
      selection: { keepSelection: true },
      sorting: {},
    });

  if (error) {
    return (
      <Box variant='h3'>
        <SpaceBetween size='s'>
          <Box variant='h3'>{`${pluralRowName} (0)`}</Box>
          <Alert
            statusIconAriaLabel='Error'
            type='error'
            header='An error has occurred.'
          >
            {error instanceof Error ? error.message : String(error)}
          </Alert>
        </SpaceBetween>
      </Box>
    );
  }

  // TODO: Memoize all the things
  const columnDefinitions = columnsToCloudscapeColumnDefinitions(columns);
  const columnDisplay = columnDisplayToCloudscapeColumnDisplay(
    userSettings.columnDisplay
  );
  const contentDisplayPreferenceOptions = columns.map((column) => ({
    id: column.id,
    label: column.name,
  }));

  const selectedItems = selectedRows ?? collectionProps.selectedItems;

  return (
    <CloudscapeTable<Row>
      {...collectionProps}
      variant='embedded'
      columnDefinitions={columnDefinitions}
      items={items}
      trackBy={rowKey}
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No {pluralRowName}.</b>
        </Box>
      }
      isItemDisabled={isRowDisabled}
      stickyColumns={userSettings.stickyColumns}
      wrapLines={userSettings.wrapLines}
      stripedRows={userSettings.stripedRows}
      columnDisplay={columnDisplay}
      contentDensity={userSettings.contentDensity}
      onSelectionChange={({ detail }) =>
        onSelectRow && onSelectRow(detail.selectedItems)
      }
      header={
        renderHeader &&
        renderHeader({
          selectedRowCount: collectionProps.selectedItems?.length ?? 0,
          totalRowCount: collectionProps.totalItemsCount ?? 0,
        })
      }
      pagination={
        <Pagination
          {...paginationProps}
          onNextPageClick={onClickNextPage}
          openEnd={hasNextPage}
        />
      }
      selectedItems={selectedItems}
      loading={isLoading}
      loadingText={`Loading ${pluralRowName.toLowerCase()}...`}
      selectionType={selectionType}
      preferences={
        isUserSettingsEnabled && (
          <CollectionPreferences
            title={`${rowName} preferences`}
            confirmLabel='Confirm'
            cancelLabel='Cancel'
            preferences={userSettings}
            onConfirm={({ detail: userSettings }) => {
              onUpdateUserSettings(userSettings as UserSettings<Row>);
            }}
            contentDensityPreference={{
              label: 'Content density',
              description: 'Select content densisty',
            }}
            pageSizePreference={{
              title: 'Select page size',
              options: SUPPORTED_PAGE_SIZES.map((size) => ({
                value: size,
                label: `${size.toString()} ${pluralRowName.toLowerCase()}`,
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
        )
      }
      filter={
        isFilterEnabled && (
          <PropertyFilter
            {...propertyFilterProps}
            filteringLoadingText='Loading suggestions'
            filteringErrorText='Error fetching suggestions.'
            filteringRecoveryText='Retry'
            filteringFinishedText='End of results'
            filteringEmpty='No suggestions found'
            i18nStrings={{
              // FIXME: remove unmodeled data stream text
              filteringAriaLabel:
                'Filter unmodeled data streams by text, property, or value',
              dismissAriaLabel: 'Dismiss',
              // FIXME: remove unmodeled data stream text
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
        )
      }
    />
  );
}

function columnsToCloudscapeColumnDefinitions<Row>(
  columns: Column<Row>[]
): CloudScapeTableProps['columnDefinitions'] {
  return columns.map(({ id, name: header, render: cell }) => ({
    id,
    header,
    cell,
  }));
}

function columnDisplayToCloudscapeColumnDisplay<Row>(
  columnDisplay: Required<UserSettings<Row>>['columnDisplay']
): NonNullable<CloudScapeTableProps['columnDisplay']> {
  return columnDisplay.map(({ id = '', isVisible: visible = false }) => ({
    id,
    visible,
  }));
}
