import React from "react";
import PropertyFilter, {
  type PropertyFilterProps,
} from "@cloudscape-design/components/property-filter";

type ExplorerPropertyFilterProps = Pick<
  PropertyFilterProps,
  "filteringOptions" | "filteringProperties" | "onChange" | "query"
>;

export function ExplorerPropertyFilter(props: ExplorerPropertyFilterProps) {
  return (
    <PropertyFilter
      {...props}
      filteringLoadingText="Loading suggestions"
      filteringErrorText="Error fetching suggestions."
      filteringRecoveryText="Retry"
      filteringFinishedText="End of results"
      filteringEmpty="No suggestions found"
      i18nStrings={{
        filteringAriaLabel: "your choice",
        dismissAriaLabel: "Dismiss",
        filteringPlaceholder: "Filter distributions by text, property or value",
        groupValuesText: "Values",
        groupPropertiesText: "Properties",
        operatorsText: "Operators",
        operationAndText: "and",
        operationOrText: "or",
        operatorLessText: "Less than",
        operatorLessOrEqualText: "Less than or equal",
        operatorGreaterText: "Greater than",
        operatorGreaterOrEqualText: "Greater than or equal",
        operatorContainsText: "Contains",
        operatorDoesNotContainText: "Does not contain",
        operatorEqualsText: "Equals",
        operatorDoesNotEqualText: "Does not equal",
        editTokenHeader: "Edit filter",
        propertyText: "Property",
        operatorText: "Operator",
        valueText: "Value",
        cancelActionText: "Cancel",
        applyActionText: "Apply",
        allPropertiesLabel: "All properties",
        tokenLimitShowMore: "Show more",
        tokenLimitShowFewer: "Show fewer",
        clearFiltersText: "Clear filters",
        removeTokenButtonAriaLabel: (token) =>
          `Remove token ${token.propertyKey} ${token.operator} ${token.value}`,
        enteredTextLabel: (text) => `Use: "${text}"`,
      }}
    />
  );
}
