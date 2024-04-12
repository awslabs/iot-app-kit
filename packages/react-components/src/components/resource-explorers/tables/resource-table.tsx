import Header from '@cloudscape-design/components/header';
import React from 'react';
import { Table, TableProps } from './table';

import { ResourceTableSettings } from '../types/resource-table';

export type ResourceTableProps<Resource> = {
  resources: Resource[];

  resourceName: TableProps<Resource>['rowName'];

  pluralResourceName: TableProps<Resource>['pluralRowName'];

  properties: TableProps<Resource>['columns'];

  selectionType?: TableProps<Resource>['selectionType'];

  onSelectResource?: TableProps<Resource>['onSelectRow'];

  isLoading?: TableProps<Resource>['isLoading'];

  resourceKey: TableProps<Resource>['rowKey'];

  // ariaLabels?: TableProps['ariaLabels'] & PaginationProps['ariaLabels'];

  selectedResources?: TableProps<Resource>['selectedRows'];

  isResourceDisabled?: TableProps<Resource>['isRowDisabled'];

  extendedHeader?: React.ReactNode;

  onClickNextPage: TableProps<Resource>['onClickNextPage'];

  hasNextPage?: TableProps<Resource>['hasNextPage'];

  error?: TableProps<Resource>['error'];

  tableSettings?: ResourceTableSettings;

  userSettings: TableProps<Resource>['userSettings'];

  onUserSettingsChange: TableProps<Resource>['onUpdateUserSettings'];
};

export const SUPPORTED_PAGE_SIZES = [10, 25, 100, 250];

export function ResourceTable<Resource>({
  resourceName,
  pluralResourceName,
  resourceKey,
  resources,
  properties,
  selectionType = undefined,
  onSelectResource,
  isLoading = false,
  selectedResources,
  isResourceDisabled,
  extendedHeader,
  onClickNextPage,
  hasNextPage,
  tableSettings: settings,
  userSettings,
  onUserSettingsChange,
  error,
}: ResourceTableProps<Resource>) {
  return (
    <Table<Resource>
      rowName={resourceName}
      pluralRowName={pluralResourceName}
      columns={properties}
      rows={resources}
      error={error}
      renderHeader={({ selectedRowCount, totalRowCount }) => (
        <>
          <Header
            variant='h3'
            counter={
              selectedRowCount > 0
                ? `(${selectedRowCount}/${totalRowCount})`
                : `(${totalRowCount})`
            }
          >
            {pluralResourceName}
          </Header>
          {extendedHeader}
        </>
      )}
      isRowDisabled={isResourceDisabled}
      onClickNextPage={onClickNextPage}
      hasNextPage={hasNextPage}
      rowKey={resourceKey}
      selectedRows={selectedResources}
      isLoading={isLoading}
      selectionType={selectionType}
      isFilterEnabled={settings?.isFilterEnabled}
      isUserSettingsEnabled={settings?.isUserSettingsEnabled}
      userSettings={userSettings}
      onUpdateUserSettings={onUserSettingsChange}
      onSelectRow={onSelectResource}
    />
  );
}
