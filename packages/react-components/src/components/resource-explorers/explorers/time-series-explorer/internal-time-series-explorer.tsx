import React from 'react';

import { useTimeSeries } from './use-time-series';
import type { TimeSeriesExplorerProps } from './types';
import {
  ResourceDropDown,
  ResourceTable,
  ResourceExplorerVariant,
} from '../../variants';
import { useUserCustomization } from '../../helpers/use-user-customization';
import {
  createDefaultTableUserSettings,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_ENABLED,
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
import {
  DEFAULT_TIME_SERIES_TABLE_DEFINITION,
  DEFAULT_TIME_SERIES_WITH_LATEST_VALUES_TABLE_DEFINITION,
} from '../../constants/table-resource-definitions';
import { DEFAULT_TIME_SERIES_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';

export function InternalTimeSeriesExplorer({
  requestFns,
  parameters = [{}],
  resourceName = DEFAULT_TIME_SERIES_RESOURCE_NAME,
  pluralResourceName = DEFAULT_PLURAL_TIME_SERIES_RESOURCE_NAME,
  isTimeSeriesDisabled = DEFAULT_IS_RESOURCE_DISABLED,
  selectedTimeSeries = DEFAULT_SELECTED_RESOURCES,
  onSelectTimeSeries = DEFAULT_ON_SELECT_RESOURCE,
  selectionMode = DEFAULT_SELECTION_MODE,
  defaultPageSize = DEFAULT_DEFAULT_PAGE_SIZE,
  variant = DEFAULT_RESOURCE_EXPLORER_VARIANT,
  shouldPersistUserCustomization = DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  tableResourceDefinition = requestFns?.batchGetAssetPropertyValue !== undefined
    ? DEFAULT_TIME_SERIES_WITH_LATEST_VALUES_TABLE_DEFINITION
    : DEFAULT_TIME_SERIES_TABLE_DEFINITION,
  defaultTableUserSettings = createDefaultTableUserSettings(
    tableResourceDefinition
  ),
  tableSettings: {
    isTitleEnabled = DEFAULT_IS_TABLE_ENABLED,
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

  const { timeSeries, isLoading, error, hasNextPage, nextPage } = useTimeSeries(
    {
      pageSize: userCustomization.pageSize,
      parameters,
      batchGetAssetPropertyValue:
        requestFns?.batchGetAssetPropertyValue?.bind(requestFns),
      listTimeSeries: requestFns?.listTimeSeries?.bind(requestFns),
    }
  );

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
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
          isTitleEnabled={isTitleEnabled}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
        />
      }
      dropDown={
        <ResourceDropDown
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
