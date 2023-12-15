import PropertyFilter, { type PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import React from 'react';

export const MODELED_DATA_STREAM_TABLE_FILTERING_PROPERTIES: PropertyFilterProps['filteringProperties'] = [
  {
    key: 'name',
    propertyLabel: 'Name',
    groupValuesLabel: 'Property names',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'assetName',
    propertyLabel: 'Asset name',
    groupValuesLabel: 'Asset names',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'dataType',
    propertyLabel: 'Data type',
    groupValuesLabel: 'Data types',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'dataTypeSpec',
    propertyLabel: 'Data type spec',
    groupValuesLabel: 'Data type specs',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'unit',
    propertyLabel: 'Unit',
    groupValuesLabel: 'Units',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'latestValue',
    propertyLabel: 'Latest value',
    groupValuesLabel: 'Latest values',
    operators: ['=', '!=', '>', '>=', '<', '<='],
  },
];

type ModeledDataStreamPropertyFilterProps = Omit<PropertyFilterProps, 'i18nStrings'>;

export function ModeledDataStreamTablePropertyFilter(props: ModeledDataStreamPropertyFilterProps) {
  return (
    <>
      <strong>Filter by:</strong>
      <PropertyFilter
        {...props}
        filteringLoadingText='Loading suggestions'
        filteringErrorText='Error fetching suggestions.'
        filteringRecoveryText='Retry'
        filteringFinishedText='End of results'
        filteringEmpty='No suggestions found'
        i18nStrings={{
          filteringAriaLabel: 'Filter modeled data streams by text, property, or value',
          dismissAriaLabel: 'Dismiss',
          filteringPlaceholder: 'Filter modeled data streams by text, property, or value',
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
          removeTokenButtonAriaLabel: (token) => `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
          enteredTextLabel: (text) => `Use: "${text}"`,
        }}
      />
    </>
  );
}
