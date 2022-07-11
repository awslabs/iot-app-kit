import React from 'react';
import { PropertyFilterProps, TableProps as AWSUITableProps } from '@awsui/components-react';
import { StatusIcon } from '@synchro-charts/core';
import { round } from '@iot-app-kit/core';
import { PropertyFilteringOption } from '@awsui/collection-hooks/dist/cjs/interfaces';
import { ColumnDefinition, TableItem } from './types';
import { getIcons } from './iconUtils';
import { LoadingSpinner } from './spinner';

export const getDefaultColumnDefinitions: (
  columnDefinitions: ColumnDefinition[]
) => (AWSUITableProps.ColumnDefinition<TableItem> & ColumnDefinition)[] = (columnDefinitions) => {
  return columnDefinitions.map((colDef) => ({
    cell: (item: TableItem) => {
      if (!(colDef.key in item)) {
        return <span />;
      }

      const { error, isLoading, value, threshold } = item[colDef.key];
      const { color = 'unset', icon } = threshold || {};
      if (error) {
        return (
          <>
            {getIcons(StatusIcon.ERROR)} {error.msg}
          </>
        );
      }

      if (isLoading) {
        return <LoadingSpinner size={16} />;
      }

      if (colDef.formatter && value) {
        return (
          <span style={{ color }}>
            {icon ? getIcons(icon) : null} {colDef.formatter(value)}
          </span>
        );
      }

      if (typeof value === 'number') {
        return (
          <span style={{ color }}>
            {icon ? getIcons(icon) : null} {round(value)}
          </span>
        );
      }
      return (
        <span style={{ color }}>
          {icon ? getIcons(icon) : null} {value}
        </span>
      );
    },
    ...colDef,
    id: colDef.id || colDef.key,
  }));
};

export const defaultI18nStrings: PropertyFilterProps.I18nStrings = {
  filteringAriaLabel: 'your choice',
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

export const formatPropertyFilterOptions: (
  propertyFilterOptions: readonly PropertyFilteringOption[],
  columnDefinitions: (AWSUITableProps.ColumnDefinition<TableItem> & ColumnDefinition)[],
  items: readonly TableItem[]
) => PropertyFilteringOption[] = (propertyFilterOptions, columnDefinitions, items) => {
  return propertyFilterOptions.map((option) => {
    const { propertyKey, value } = option;

    const colDef = columnDefinitions.find(({ key }) => key === propertyKey);
    if (colDef) {
      const tableItem = items.find((item) => {
        return item?.[propertyKey]?.valueOf() && `${item[propertyKey].valueOf()}` === value;
      });
      if (tableItem) {
        const cellItem = tableItem[propertyKey];
        const { value: cellValue } = cellItem;

        // Error or isLoading
        if (!cellValue) {
          return option;
        }

        // Customized formatter is disabled because it is not compatible with Property filtering.

        // const { formatter } = colDef;
        // if (formatter) {
        //   return {
        //     propertyKey,
        //     value: `${formatter(cellValue)}`,
        //   };
        // }

        // apply default formatter for numbers
        if (typeof cellValue === 'number') {
          return {
            propertyKey,
            value: `${round(cellValue)}`,
          };
        }
      }
    }
    return option;
  });
};
