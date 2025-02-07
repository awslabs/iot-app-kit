import type { PropertyFilterProperty } from '@cloudscape-design/collection-hooks';
import type { TableColumnDefinition } from '@iot-app-kit/react-components';
import type { Resolution } from '@iot-app-kit/source-iotsitewise';

export const TABLE_WIDGET_TYPE = 'table';
export const WIDGET_INITIAL_HEIGHT = 400;
export const WIDGET_INITIAL_WIDTH = 600;

// FIXME: get correct number
export const TABLE_WIDGET_MAX_HEIGHT = 600;
// FIXME: get correct number
export const TABLE_WIDGET_OVERFLOW_HEIGHT = 600;

export const DEFAULT_AGGREGATION = undefined;
export const DEFAULT_RESOLUTION = '0' satisfies Resolution;

export const DEFAULT_TABLE_COLUMN_DEFINITIONS: TableColumnDefinition[] = [
  {
    key: 'property',
    header: 'Property',
    sortingField: 'property',
  },
  {
    key: 'value',
    header: 'Latest value',
    sortingField: 'value',
  },
  {
    key: 'unit',
    header: 'Unit',
    sortingField: 'unit',
  },
];
export const DEFAULT_PREFERENCES = {
  pageSize: 20,
};
export const PAGE_SIZE_PREFERENCE = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 resources' },
    { value: 20, label: '20 resources' },
    { value: 30, label: '30 resources' },
  ],
};
export const COLLECTION_PREFERENCES_PROPS = {
  pageSizePreference: PAGE_SIZE_PREFERENCE,
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  title: 'Preferences',
};
export const PROPERTY_FILTERING: {
  filteringProperties: PropertyFilterProperty<string>[];
} = {
  filteringProperties: [
    {
      key: 'property',
      propertyLabel: 'Property',
      groupValuesLabel: 'Property IDs',
      operators: [':', '!:', '=', '!='],
    },
    {
      key: 'value',
      propertyLabel: 'Value',
      groupValuesLabel: 'Value',
      operators: [':', '!:', '=', '!='],
    },
    {
      key: 'unit',
      propertyLabel: 'Unit',
      groupValuesLabel: 'Unit',
      operators: [':', '!:', '=', '!='],
    },
  ],
};
