import { useMemo } from 'react';
import { noop } from 'lodash';

import type {
  AlarmByAssetRequestParameters,
  AlarmExplorerProps,
  AlarmResourcesRequestParameters,
} from './types';
import {
  ResourceDropDown,
  ResourceTable,
  ResourceExplorerVariant,
} from '../../variants';
import {
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_SEARCH_ENABLED,
  DEFAULT_IS_TABLE_ENABLED,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  createDefaultTableUserSettings,
  DEFAULT_ALARM_RESOURCE_NAME,
  DEFAULT_PLURAL_ALARM_RESOURCE_NAME,
  latestValueTimeCellRenderer,
  latestValueCellRenderer,
} from '../../constants/defaults';
import { type AlarmResourceWithLatestValue } from '../../types/resources';
import {
  ALARM_TABLE_ASSET_ID_DEFINITION,
  DEFAULT_ALARM_TABLE_DEFINITION,
  createDefaultLatestValuesTableDefinition,
} from '../../constants/table-resource-definitions';
import { DEFAULT_ALARM_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { useUserCustomization } from '../../helpers/use-user-customization';
import { type TableResourceDefinition } from '../../types/table';
import { useAlarms } from '../../../../hooks/useAlarms';
import { isAlarmResource, transformAlarmData } from './transformAlarmData';

export function InternalAlarmExplorer({
  iotSiteWiseClient,
  iotEventsClient,
  parameters = [],
  shouldPersistUserCustomization = DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  defaultPageSize = DEFAULT_DEFAULT_PAGE_SIZE,
  variant = DEFAULT_RESOURCE_EXPLORER_VARIANT,
  resourceName = DEFAULT_ALARM_RESOURCE_NAME,
  pluralResourceName = DEFAULT_PLURAL_ALARM_RESOURCE_NAME,
  isAlarmDisabled = DEFAULT_IS_RESOURCE_DISABLED,
  selectedAlarms = DEFAULT_SELECTED_RESOURCES,
  onSelectAlarm = DEFAULT_ON_SELECT_RESOURCE,
  selectionMode = DEFAULT_SELECTION_MODE,
  tableResourceDefinition: customTableResourceDefinition,
  defaultTableUserSettings: customDefaultTableUserSettings,
  tableSettings: {
    isTitleEnabled = DEFAULT_IS_TABLE_ENABLED,
    isSearchEnabled = DEFAULT_IS_TABLE_SEARCH_ENABLED,
    isFilterEnabled: isTableFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_ALARM_DROP_DOWN_DEFINITION,
  dropDownSettings: { isFilterEnabled: isDropDownFilterEnabled = false } = {},
  ariaLabels,
  description = '',
  timeZone,
  significantDigits,
}: AlarmExplorerProps) {
  const requests = useMemo(
    () =>
      isAlarmByAssetRequestParameters(parameters)
        ? parameters.map((p) => ({ assetId: p.assetId }))
        : parameters.map((p) => ({ assetModelId: p.assetModelId })),
    [parameters]
  );

  const alarms = useAlarms({
    iotEventsClient,
    iotSiteWiseClient,
    requests,
    transform: transformAlarmData,
    settings: {
      fetchOnlyLatest: true,
      refreshRate: 5000,
    },
  });

  const alarmResources = useMemo(
    () => alarms.map(({ resource }) => resource).filter(isAlarmResource),
    [alarms]
  );

  const isLoading = useMemo(
    () => alarms.some(({ status }) => status.isLoading),
    [alarms]
  );

  const error = useMemo(() => {
    const isError = alarms.some(({ status }) => status.isError);

    if (!isError) return null;

    // TODO: Will use error from hook once api is finalized
    return new Error('Error loading SiteWise alarms.');
  }, [alarms]);

  const alarmAssetRequestTableDefinition = isAlarmByAssetRequestParameters(
    parameters
  )
    ? [
        ...ALARM_TABLE_ASSET_ID_DEFINITION,
        ...createDefaultLatestValuesTableDefinition(
          latestValueTimeCellRenderer(timeZone),
          latestValueCellRenderer(significantDigits)
        ),
      ]
    : [];

  const tableResourceDefinition =
    customTableResourceDefinition ??
    ([
      ...DEFAULT_ALARM_TABLE_DEFINITION,
      ...alarmAssetRequestTableDefinition,
    ] as TableResourceDefinition<AlarmResourceWithLatestValue>);

  const defaultTableUserSettings =
    customDefaultTableUserSettings ??
    createDefaultTableUserSettings(tableResourceDefinition);

  const [userCustomization, setUserCutomization] = useUserCustomization({
    resourceName,
    defaultPageSize,
    defaultTableUserSettings,
    shouldPersistUserCustomization,
  });

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={tableResourceDefinition}
          resources={alarmResources}
          createResourceKey={createResourceKey}
          isResourceDisabled={isAlarmDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAlarms}
          onSelectResource={onSelectAlarm}
          onClickNextPage={noop}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          isTitleEnabled={isTitleEnabled}
          isSearchEnabled={isSearchEnabled}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
          ariaLabels={ariaLabels}
          description={description}
        />
      }
      dropDown={
        <ResourceDropDown
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={alarmResources}
          isResourceDisabled={isAlarmDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAlarms}
          onSelectResource={onSelectAlarm}
          hasNextPage={false}
          onScrollNextPage={noop}
          isFilterEnabled={isDropDownFilterEnabled}
        />
      }
    />
  );
}

function createResourceKey({
  assetId,
  assetCompositeModelId,
}: AlarmResourceWithLatestValue): string {
  return `${assetId}-${assetCompositeModelId}`;
}

function isAlarmByAssetRequestParameters(
  parameters: AlarmResourcesRequestParameters
): parameters is readonly AlarmByAssetRequestParameters[] {
  return (
    parameters[0] !== undefined &&
    Boolean((parameters[0] as AlarmByAssetRequestParameters).assetId)
  );
}
