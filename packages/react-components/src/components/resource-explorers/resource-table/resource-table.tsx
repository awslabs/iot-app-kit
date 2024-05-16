import { useCollection as useCloudscapeCollection } from '@cloudscape-design/collection-hooks';

import CloudscapeTable, {
  type TableProps as CloudScapeTableProps,
} from '@cloudscape-design/components/table';
import React from 'react';

import { ResourceTableSearch } from './resource-table-search';
import { ResourceTableFilter } from './resource-table-filter';
import { ResourceTableHeader } from './resource-table-header';

import type {
  ResourceTableProps,
  TableResourceField,
  UserCustomization,
} from '../types/table';
import { ResourceTableUserSettings } from './resource-table-user-settings';
import { ResourceTableError } from './resource-table-error';
import { ResourceTableEmpty } from './resource-table-empty';
import { ResourceTableTitle } from './resource-table-title';
import { ResourceTablePagination } from './resource-table-pagination';
import { ResourceTableNoFilterMatch } from './resource-table-no-filter-match';

export function ResourceTable<Resource>({
  resourceName,
  pluralResourceName,
  ariaLabels,
  resourceDefinition: resourceFields,
  resources,
  createResourceKey,
  isResourceDisabled,
  error,
  isLoading,
  onSelectResource = () => {},
  selectedResources,
  selectionMode,
  onClickSearch = () => {},
  userCustomization,
  onUpdateUserCustomization,
  onClickNextPage,
  hasNextPage,
  isTitleless,
  isFilterEnabled,
  isUserSettingsEnabled,
  isSearchEnabled,
  titleExtension,
}: ResourceTableProps<Resource>) {
  const {
    items,
    actions: { setPropertyFiltering },
    collectionProps,
    paginationProps: {
      currentPageIndex: currentPage,
      pagesCount: totalPageCount,
      onChange: onClickChangePage,
    },
    propertyFilterProps: {
      query: filterQuery,
      filteringProperties: filterProperties,
      filteringOptions: filterOptions,
      onChange: onUpdateQuery,
    },
  } = useCloudscapeCollection<Resource>(resources, {
    propertyFiltering: {
      filteringProperties: resourceFields
        .filter(({ filterOperators = [] }) => filterOperators.length > 0)
        .map(
          ({
            id: key,
            name: propertyLabel,
            pluralName: groupValuesLabel,
            filterOperators: operators,
          }) => ({
            key,
            propertyLabel,
            groupValuesLabel,
            operators,
          })
        ),
      empty: <ResourceTableEmpty pluralResourceName={pluralResourceName} />,
      noMatch: (
        <ResourceTableNoFilterMatch
          pluralResourceName={pluralResourceName}
          onClickResetFilter={() =>
            setPropertyFiltering({ tokens: [], operation: 'and' })
          }
        />
      ),
    },
    pagination: { pageSize: userCustomization.pageSize },
    selection: { keepSelection: true, trackBy: createResourceKey },
    sorting: {},
  });

  if (error) {
    return (
      <ResourceTableError
        pluralResourceName={pluralResourceName}
        error={error}
      />
    );
  }

  // TODO: Memoize all the things
  const columnDefinitions =
    resourceFieldsToCloudscapeColumnDefinitions(resourceFields);
  const columnDisplay = columnDisplayToCloudscapeColumnDisplay(
    userCustomization.columnDisplay
  );

  return (
    <>
      <ResourceTableHeader
        isTitleless={isTitleless}
        isFilterEnabled={isFilterEnabled}
        isSearchEnabled={isSearchEnabled}
        isUserSettingsEnabled={isUserSettingsEnabled}
        title={
          <ResourceTableTitle
            selectedResourceCount={collectionProps.selectedItems?.length ?? 0}
            totalResourceCount={collectionProps.totalItemsCount ?? 0}
            pluralResourceName={pluralResourceName}
            titleExtension={titleExtension}
          />
        }
        search={<ResourceTableSearch onClickSearch={onClickSearch} />}
        filter={
          <ResourceTableFilter
            pluralResourceName={pluralResourceName}
            filterQuery={filterQuery}
            filterProperties={filterProperties}
            filterOptions={filterOptions}
            onUpdateQuery={onUpdateQuery}
          />
        }
        pagination={
          <ResourceTablePagination
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            hasNextPage={hasNextPage}
            onClickChangePage={onClickChangePage}
            onClickNextPage={onClickNextPage}
            isLoading={isLoading}
          />
        }
        userSettings={
          <ResourceTableUserSettings
            resourceName={resourceName}
            resourceFields={resourceFields}
            userCustomization={userCustomization}
            onUpdateUserCustomization={onUpdateUserCustomization}
          />
        }
      />

      <CloudscapeTable<Resource>
        {...collectionProps}
        variant='embedded'
        columnDefinitions={columnDefinitions}
        items={items}
        isItemDisabled={isResourceDisabled}
        stickyColumns={userCustomization.stickyColumns}
        wrapLines={userCustomization.wrapLines}
        stripedRows={userCustomization.stripedRows}
        contentDensity={userCustomization.contentDensity}
        columnDisplay={columnDisplay}
        onSelectionChange={({
          detail: { selectedItems: updatedSelectedResources },
        }) => {
          onSelectResource(updatedSelectedResources);
        }}
        selectedItems={selectedResources}
        loading={isLoading}
        loadingText={`Loading ${pluralResourceName.toLowerCase()}...`}
        selectionType={selectionMode}
        resizableColumns
        ariaLabels={{
          selectionGroupLabel: ariaLabels.selectionGroupLabel,
          allItemsSelectionLabel: ({ selectedItems: selectedResources }) =>
            ariaLabels.allResourcesSelectionLabel(selectedResources),
          itemSelectionLabel: (_, resource) =>
            ariaLabels.resourceSelectionLabel(resource),
        }}
      />
    </>
  );
}

function resourceFieldsToCloudscapeColumnDefinitions<Resource>(
  resourceFields: TableResourceField<Resource>[]
): CloudScapeTableProps['columnDefinitions'] {
  return resourceFields.map(({ id, name: header, render: cell }) => ({
    id,
    header,
    cell,
    sortingField: id,
  }));
}

function columnDisplayToCloudscapeColumnDisplay(
  columnDisplay: Required<UserCustomization>['columnDisplay']
): NonNullable<CloudScapeTableProps['columnDisplay']> {
  return columnDisplay.map(({ id = '', isVisible: visible = false }) => ({
    id,
    visible,
  }));
}
