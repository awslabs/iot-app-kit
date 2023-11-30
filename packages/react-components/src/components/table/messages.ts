import type { PropertyFilterProps } from '@cloudscape-design/components';

export type PropertyFilterMessages = PropertyFilterProps.I18nStrings;

export type TableCellMessages = {
  loading: string;
};

export type TableMessages = {
  propertyFilter: PropertyFilterMessages;
  tableCell: TableCellMessages;
};

export const DEFAULT_TABLE_CELL_MESSAGES: TableCellMessages = {
  loading: 'Loading',
};

export const DEFAULT_PROPERTY_FILTER_MESSAGES: PropertyFilterMessages = {
  filteringAriaLabel: 'Search table',
  dismissAriaLabel: 'Dismiss',
  filteringPlaceholder: 'Search',
  groupValuesText: 'Values',
  groupPropertiesText: 'Properties',
  operatorsText: 'Operators',
  operationAndText: 'and',
  operationOrText: 'or',
  operatorLessText: 'Less than',
  operatorLessOrEqualText: 'Less than or equal',
  operatorGreaterText: 'Greater than',
  operatorGreaterOrEqualText: 'Greater than or equal',
  operatorContainsText: 'Contains',
  operatorDoesNotContainText: 'Does not contain',
  operatorEqualsText: 'Equals',
  operatorDoesNotEqualText: 'Does not equal',
  editTokenHeader: 'Edit filter',
  propertyText: 'Property',
  operatorText: 'Operator',
  valueText: 'Value',
  cancelActionText: 'Cancel',
  applyActionText: 'Apply',
  allPropertiesLabel: 'All properties',
  tokenLimitShowMore: 'Show more',
  tokenLimitShowFewer: 'Show fewer',
  clearFiltersText: 'Clear filters',
  removeTokenButtonAriaLabel: () => 'Remove token',
  enteredTextLabel: (text) => `Use: "${text}"`,
};

export const DEFAULT_TABLE_MESSAGES: TableMessages = {
  tableCell: DEFAULT_TABLE_CELL_MESSAGES,
  propertyFilter: DEFAULT_PROPERTY_FILTER_MESSAGES,
};
