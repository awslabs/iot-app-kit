import React from 'react';
import { PropertyFilterProps, TableProps as AWSUITableProps } from '@awsui/components-react';
import { StatusIcon } from '@synchro-charts/core';
import { round } from '@iot-app-kit/core';
import { ColumnDefinition, TableItem } from './types';
import { getIcons } from './iconUtils';
import { LoadingSpinner } from './spinner';

export const getDefaultColumnDefinitions: (
  columnDefinitions: ColumnDefinition<TableItem>[]
) => AWSUITableProps.ColumnDefinition<TableItem>[] = (columnDefinitions) => {
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
