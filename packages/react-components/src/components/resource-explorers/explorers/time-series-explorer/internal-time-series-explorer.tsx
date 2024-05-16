import React from 'react';

import { useUserCustomization } from '../../use-user-customization';
import {
  createDefaultTableUserSettings,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_TITLELESS,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_PLURAL_TIME_SERIES_RESOURCE_NAME,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  DEFAULT_TIME_SERIES_RESOURCE_NAME,
} from '../../constants/defaults';
import type { TimeSeriesResource } from '../../types/resources';
import type { TimeSeriesExplorerProps } from './types';
import { ResourceTable } from '../../resource-table';
import { useMultipleListRequests } from '../../requests/use-multiple-list-requests';
import { DEFAULT_TIME_SERIES_TABLE_DEFINITION } from '../../constants/table-resource-definitions';
import { ResourceDropDown } from '../../resource-drop-down';
import { DEFAULT_TIME_SERIES_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { transformListTimeSeriesResponse } from '../../helpers/response-transformers';
import { ResourceExplorerVariant } from '../variant-selector';
import { DEFAULT_TIME_SERIES_ARIA_LABELS } from '../../constants/aria-labels';

export function InternalTimeSeriesExplorer({
  requestFns,
  parameters,
  resourceName = DEFAULT_TIME_SERIES_RESOURCE_NAME,
  pluralResourceName = DEFAULT_PLURAL_TIME_SERIES_RESOURCE_NAME,
  isTimeSeriesDisabled = DEFAULT_IS_RESOURCE_DISABLED,
  selectedTimeSeries = DEFAULT_SELECTED_RESOURCES,
  onSelectTimeSeries = DEFAULT_ON_SELECT_RESOURCE,
  selectionMode = DEFAULT_SELECTION_MODE,
  defaultPageSize = DEFAULT_DEFAULT_PAGE_SIZE,
  variant = DEFAULT_RESOURCE_EXPLORER_VARIANT,
  shouldPersistUserCustomization = DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  tableResourceDefinition = DEFAULT_TIME_SERIES_TABLE_DEFINITION,
  defaultTableUserSettings = createDefaultTableUserSettings(
    tableResourceDefinition
  ),
  tableSettings: {
    isTitleless = DEFAULT_IS_TABLE_TITLELESS,
    isFilterEnabled: isTableFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_TIME_SERIES_DROP_DOWN_DEFINITION,
  dropDownSettings: { isFilterEnabled: isDropDownFilterEnabled = false } = {},
}: TimeSeriesExplorerProps) {
  const [userCustomization, setUserCutomization] = useUserCustomization({
    resourceName,
    defaultPageSize,
    defaultTableUserSettings,
    shouldPersistUserCustomization,
  });

  const {
    resources: timeSeries,
    isLoading,
    error,
    hasNextPage,
    nextPage,
  } = useMultipleListRequests({
    pageSize: userCustomization.pageSize,
    resourceId: 'TimeSeriesSummary',
    // @ts-expect-error todo
    parameters: parameters,
    // @ts-expect-error todo
    requestFn: requestFns?.listTimeSeries?.bind(requestFns),
    responseTransformer: transformListTimeSeriesResponse,
  });

  /*
  const { responseEntries } = useLatestValues({
    dataStreamResources: timeSeries,
    batchGetAssetPropertyValue:
      requestFns?.batchGetAssetPropertyValue?.bind(requestFns),
    createEntryId: ({ timeSeriesId }) => timeSeriesId,
  });
  */

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable<TimeSeriesResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          ariaLabels={DEFAULT_TIME_SERIES_ARIA_LABELS.tableAriaLabels}
          resourceDefinition={tableResourceDefinition}
          resources={timeSeries}
          createResourceKey={createResourceKey}
          isResourceDisabled={isTimeSeriesDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedTimeSeries}
          onSelectResource={onSelectTimeSeries}
          hasNextPage={hasNextPage}
          onClickNextPage={nextPage}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          isTitleless={isTitleless}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
        />
      }
      dropDown={
        <ResourceDropDown<TimeSeriesResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={timeSeries}
          isResourceDisabled={isTimeSeriesDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedTimeSeries}
          onSelectResource={onSelectTimeSeries}
          hasNextPage={hasNextPage}
          onScrollNextPage={nextPage}
          isFilterEnabled={isDropDownFilterEnabled}
        />
      }
    />
  );
}

function createResourceKey({ timeSeriesId }: TimeSeriesResource): string {
  return timeSeriesId;
}
