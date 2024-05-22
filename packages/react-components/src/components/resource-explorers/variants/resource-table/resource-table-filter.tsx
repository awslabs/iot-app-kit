import CloudscapePropertyFilter, {
  type PropertyFilterProps as CloudscapePropertyFilterProps,
} from '@cloudscape-design/components/property-filter';
import {
  colorTextFormDefault,
  fontSizeBodyM,
  fontWeightHeadingXs,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';
import React from 'react';

import './resource-table-filter.css';

type FilterQuery = CloudscapePropertyFilterProps['query'];
type OnUpdateQuery = CloudscapePropertyFilterProps['onChange'];
type FilterProperty =
  CloudscapePropertyFilterProps['filteringProperties'][number];
type FilterOption = NonNullable<
  CloudscapePropertyFilterProps['filteringOptions']
>[number];

export interface ResourceTableFilterProps {
  pluralResourceName: string;
  filterQuery: FilterQuery;
  filterProperties: readonly FilterProperty[];
  filterOptions: readonly FilterOption[];
  onUpdateQuery: OnUpdateQuery;
}

export function ResourceTableFilter({
  pluralResourceName,
  filterQuery,
  filterProperties,
  filterOptions,
  onUpdateQuery,
}: ResourceTableFilterProps) {
  return (
    <div className='filter-field'>
      <label
        htmlFor='filter'
        style={{
          color: colorTextFormDefault,
          fontSize: fontSizeBodyM,
          fontWeight: fontWeightHeadingXs,
          marginRight: spaceScaledXs,
        }}
      >
        Filter
      </label>

      <div className='filter-field-input'>
        <CloudscapePropertyFilter
          controlId='filter'
          query={filterQuery}
          filteringProperties={filterProperties}
          filteringOptions={filterOptions}
          onChange={onUpdateQuery}
          filteringLoadingText='Loading suggestions'
          filteringErrorText='Error fetching suggestions.'
          filteringRecoveryText='Retry'
          filteringFinishedText='End of results'
          filteringEmpty='No suggestions found'
          i18nStrings={{
            filteringAriaLabel: `Filter ${pluralResourceName.toLowerCase()} by text, property, or value`,
            dismissAriaLabel: 'Dismiss',
            filteringPlaceholder: `Filter ${pluralResourceName.toLowerCase()} by text, property, or value`,
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
            removeTokenButtonAriaLabel: (token) =>
              `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
            enteredTextLabel: (text) => `Use: "${text}"`,
          }}
        />
      </div>
    </div>
  );
}
