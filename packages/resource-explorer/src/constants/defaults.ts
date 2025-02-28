import { formatDate, type RequestTimeout } from '@iot-app-kit/core';
import type {
  IsResourceDisabled,
  IsTableFilterEnabled,
  IsTableSearchEnabled,
  IsTitleEnabled,
  IsTableUserSettingsEnabled,
  IsVisible,
  OnSelectResource,
  PluralResourceName,
  ResourceDropDownVariant,
  ResourceExplorerVariant,
  ResourceFieldFilterOperator,
  ResourceName,
  ResourceTableVariant,
  SelectedResources,
  SelectionMode,
  ShouldPersistUserCustomization,
} from '../types/common';
import type {
  ResourceTableUserSettings,
  TableResourceField,
} from '../types/table';
import { type DataStreamResourceWithLatestValue } from '../types/resources';
import { isNumeric, round } from '@iot-app-kit/core-util';

const NO_OP = () => {};

export const DEFAULT_ASSET_MODEL_RESOURCE_NAME: ResourceName = 'Asset model';
export const DEFAULT_PLURAL_ASSET_MODEL_RESOURCE_NAME: PluralResourceName =
  'Asset models';
export const DEFAULT_ASSET_RESOURCE_NAME: ResourceName = 'Asset';
export const DEFAULT_PLURAL_ASSET_RESOURCE_NAME = 'Assets';
export const DEFAULT_ASSET_PROPERTY_RESOURCE_NAME: ResourceName =
  'Asset property';
export const DEFAULT_PLURAL_ASSET_PROPERTY_RESOURCE_NAME: PluralResourceName =
  'Asset properties';
export const DEFAULT_TIME_SERIES_RESOURCE_NAME: ResourceName = 'Time series';
export const DEFAULT_PLURAL_TIME_SERIES_RESOURCE_NAME: PluralResourceName =
  'Time series';
export const DEFAULT_ALARM_RESOURCE_NAME: ResourceName = 'Alarm';
export const DEFAULT_PLURAL_ALARM_RESOURCE_NAME: PluralResourceName = 'Alarms';

export const DEFAULT_IS_RESOURCE_DISABLED: IsResourceDisabled<unknown> = () =>
  false;

export const DEFAULT_SELECTION_MODE: SelectionMode = undefined;
export const DEFAULT_SELECTED_RESOURCES: SelectedResources<never> = [];
export const DEFAULT_ON_SELECT_RESOURCE: OnSelectResource<unknown> = NO_OP;

export const DEFAULT_IS_TABLE_ENABLED: IsTitleEnabled = true;
export const DEFAULT_IS_TABLE_SEARCH_ENABLED: IsTableSearchEnabled = false;
export const DEFAULT_IS_TABLE_FILTER_ENABLED: IsTableFilterEnabled = false;
export const DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED: IsTableUserSettingsEnabled =
  false;

export const RESOURCE_TABLE_VARIANT: ResourceTableVariant = 'table';
export const RESOURCE_DROP_DOWN_VARIANT: ResourceDropDownVariant = 'drop-down';
export const DEFAULT_RESOURCE_EXPLORER_VARIANT =
  RESOURCE_TABLE_VARIANT satisfies ResourceExplorerVariant;

export const DEFAULT_SUPPORTED_PAGE_SIZES = [10, 25, 100, 250] as const;
export const DEFAULT_DEFAULT_PAGE_SIZE = DEFAULT_SUPPORTED_PAGE_SIZES[0];

const DEFAULT_DEFAULT_IS_VISIBLE: IsVisible = true;

export const DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION: ShouldPersistUserCustomization =
  false;
export function createDefaultTableUserSettings<Resource>(
  resourceFields: TableResourceField<Resource>[]
): ResourceTableUserSettings {
  const columnDisplay = resourceFields.map(
    ({ id, defaultIsVisible = DEFAULT_DEFAULT_IS_VISIBLE }) => ({
      id,
      isVisible: defaultIsVisible,
    })
  );

  return {
    columnDisplay,
    wrapLines: false,
    stickyColumns: { first: undefined, last: undefined },
    stripedRows: false,
    contentDensity: 'comfortable',
  };
}

export const latestValueTimeCellRenderer = (timeZone?: string) => {
  return (latestValueResource: DataStreamResourceWithLatestValue<unknown>) => {
    return latestValueResource.latestValueTimestamp
      ? formatDate(latestValueResource.latestValueTimestamp * 1000, {
          timeZone,
        })
      : '-';
  };
};

export const latestValueCellRenderer = (significantDigits?: number) => {
  return (latestValueResource: DataStreamResourceWithLatestValue<unknown>) => {
    if (
      latestValueResource.latestValue &&
      isNumeric(latestValueResource.latestValue)
    ) {
      return round(latestValueResource.latestValue, significantDigits);
    }
    return latestValueResource.latestValue;
  };
};

export const DEFAULT_STRING_FILTER_OPERATORS = [
  '=',
  '!=',
  ':',
  '!:',
] as const satisfies readonly ResourceFieldFilterOperator[];

export const DEFAULT_REQUEST_TIMEOUT: RequestTimeout = 5000;

export const DEFAULT_LATEST_VALUE_REQUEST_INTERVAL = 60000;
