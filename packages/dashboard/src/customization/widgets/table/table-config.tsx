import { type PropertyFilterProperty } from '@cloudscape-design/collection-hooks';

export const DEFAULT_PREFERENCES = {
  pageSize: 20,
};

export const pageSizePreference = {
  title: 'Select page size',
  options: [
    { value: 10, label: '10 resources' },
    { value: 20, label: '20 resources' },
    { value: 30, label: '30 resources' },
  ],
};

export const collectionPreferencesProps = {
  pageSizePreference,
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
