import PropertyFilter, {
  PropertyFilterProps,
} from '@cloudscape-design/components/property-filter';
import React from 'react';

export const PropertyPanelTableFilter = (
  props: Omit<PropertyFilterProps, 'i18nStrings'>
) => {
  return (
    <>
      <PropertyFilter
        {...props}
        filteringLoadingText='Loading suggestions'
        filteringErrorText='Error fetching suggestions.'
        filteringRecoveryText='Retry'
        filteringFinishedText='End of results'
        filteringEmpty='No suggestions found'
        i18nStrings={{
          filteringPlaceholder:
            'Filter properties by property name or asset name',
          dismissAriaLabel: 'Dismiss',
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
    </>
  );
};
