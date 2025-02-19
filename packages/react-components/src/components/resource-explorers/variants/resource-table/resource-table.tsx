import { useCollection as useCloudscapeCollection } from '@cloudscape-design/collection-hooks';
import CloudscapeTable, {
  type TableProps as CloudScapeTableProps,
} from '@cloudscape-design/components/table';
import type {
  ResourceTableProps,
  TableResourceField,
  UserCustomization,
} from '../../types/table';
import { ResourceTableEmpty } from './resource-table-empty';
import { ResourceTableError } from './resource-table-error';
import { ResourceTableFilter } from './resource-table-filter';
import { ResourceTableHeader } from './resource-table-header';
import { ResourceTableNoFilterMatch } from './resource-table-no-filter-match';
import { ResourceTablePagination } from './resource-table-pagination';
import { ResourceTableSearch } from './resource-table-search';
import { ResourceTableTitle } from './resource-table-title';
import { ResourceTableUserSettings } from './resource-table-user-settings';
import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';

export function ResourceTable<Resource>({
  resourceName,
  pluralResourceName,
  resourceDefinition: resourceFields,
  resources,
  createResourceKey,
  isResourceDisabled,
  isLoadingFirstPage,
  isLoadingResources,
  error,
  onSelectResource = () => {},
  selectedResources,
  selectionMode,
  onClickSearch = () => {},
  userCustomization,
  onUpdateUserCustomization,
  isTitleEnabled,
  isFilterEnabled,
  isUserSettingsEnabled,
  isSearchEnabled,
  titleExtension,
  description,
  ariaLabels,
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
      empty: error ? (
        // Cloudscape design pattern recommends using the error alert in the table empty state
        // https://cloudscape.design/patterns/resource-management/view/table-view/#key-ux-concepts
        <ResourceTableError error={error} />
      ) : (
        <ResourceTableEmpty pluralResourceName={pluralResourceName} />
      ),
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

  const columnDefinitions =
    resourceFieldsToCloudscapeColumnDefinitions(resourceFields);
  const columnDisplay = columnDisplayToCloudscapeColumnDisplay(
    userCustomization.columnDisplay
  );

  return (
    <div style={{ backgroundColor: colorBackgroundContainerContent }}>
      <ResourceTableHeader
        title={
          isTitleEnabled && (
            <ResourceTableTitle
              selectedResourceCount={collectionProps.selectedItems?.length ?? 0}
              totalResourceCount={collectionProps.totalItemsCount ?? 0}
              pluralResourceName={pluralResourceName}
              titleExtension={titleExtension}
              description={description}
              isLoadingResources={isLoadingResources}
            />
          )
        }
        search={
          isSearchEnabled && (
            <ResourceTableSearch onClickSearch={onClickSearch} />
          )
        }
        filter={
          isFilterEnabled && (
            <ResourceTableFilter
              pluralResourceName={pluralResourceName}
              filterQuery={filterQuery}
              filterProperties={filterProperties}
              filterOptions={filterOptions}
              onUpdateQuery={onUpdateQuery}
            />
          )
        }
        pagination={
          <ResourceTablePagination
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            onClickChangePage={onClickChangePage}
            // only show page elipsis when page size has been crossed and there is still loading
            isLoadingResources={
              isLoadingResources &&
              resources.length > userCustomization.pageSize
            }
          />
        }
        userSettings={
          isUserSettingsEnabled && (
            <ResourceTableUserSettings
              resourceName={resourceName}
              resourceFields={resourceFields}
              userCustomization={userCustomization}
              onUpdateUserCustomization={onUpdateUserCustomization}
            />
          )
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
        selectedItems={selectedResources.filter(
          (resource) => !isResourceDisabled(resource)
        )}
        loading={isLoadingFirstPage}
        loadingText={`Loading ${pluralResourceName.toLowerCase()}...`}
        selectionType={selectionMode}
        resizableColumns
        ariaLabels={ariaLabels}
      />
    </div>
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
