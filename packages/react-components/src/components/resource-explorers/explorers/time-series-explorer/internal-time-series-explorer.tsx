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
  latestValueCellRenderer,
  latestValueTimeCellRenderer,
} from '../../constants/defaults';
import type { TimeSeriesResource } from '../../types/resources';
import {
  DEFAULT_TIME_SERIES_TABLE_DEFINITION,
  createDefaultLatestValuesTableDefinition,
} from '../../constants/table-resource-definitions';
import { DEFAULT_TIME_SERIES_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { TableResourceDefinition } from '../../types/table';

export function InternalTimeSeriesExplorer({
  iotSiteWiseClient,
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
  tableResourceDefinition: customTableResourceDefinition,
  defaultTableUserSettings: customDefaultTableUserSettings,
  tableSettings: {
    isTitleEnabled = DEFAULT_IS_TABLE_ENABLED,
    isFilterEnabled: isTableFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_TIME_SERIES_DROP_DOWN_DEFINITION,
  dropDownSettings: { isFilterEnabled: isDropDownFilterEnabled = false } = {},
  description = '',
  timeZone,
  significantDigits,
}: TimeSeriesExplorerProps) {
  const tableResourceDefinition =
    customTableResourceDefinition ??
    iotSiteWiseClient?.batchGetAssetPropertyValue !== undefined
      ? ([
          ...DEFAULT_TIME_SERIES_TABLE_DEFINITION,
          ...createDefaultLatestValuesTableDefinition(
            latestValueTimeCellRenderer(timeZone),
            latestValueCellRenderer(significantDigits)
          ),
        ] as TableResourceDefinition<TimeSeriesResource>)
      : DEFAULT_TIME_SERIES_TABLE_DEFINITION;

  const defaultTableUserSettings =
    customDefaultTableUserSettings ??
    createDefaultTableUserSettings(tableResourceDefinition);

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
        iotSiteWiseClient?.batchGetAssetPropertyValue?.bind(iotSiteWiseClient),
      listTimeSeries:
        iotSiteWiseClient?.listTimeSeries?.bind(iotSiteWiseClient),
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
          description={description}
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
