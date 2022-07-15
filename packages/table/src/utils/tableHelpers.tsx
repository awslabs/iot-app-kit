import React from 'react';
import { PropertyFilterProps, TableProps as AWSUITableProps } from '@awsui/components-react';
import { StatusIcon } from '@synchro-charts/core';
import { round } from '@iot-app-kit/core';
import { ColumnDefinition, TableItem } from './types';
import { getIcons } from './iconUtils';
import { LoadingSpinner } from './spinner';
import './style.css';

export const getDefaultColumnDefinitions: (
  columnDefinitions: ColumnDefinition[]
) => (AWSUITableProps.ColumnDefinition<TableItem> & ColumnDefinition)[] = (columnDefinitions) => {
  return columnDefinitions.map((colDef) => ({
    cell: (item: TableItem) => {
      if (!(colDef.key in item)) {
        return <div>-</div>;
      }

      const { error, isLoading, value, threshold } = item[colDef.key];
      const { color = 'unset', icon } = threshold || {};
      if (error) {
        return (
          <div className="iot-table-cell">
            <div className="icon">{getIcons(StatusIcon.ERROR)}</div> {error.msg}
          </div>
        );
      }

      if (isLoading) {
        return <LoadingSpinner size={16} />;
      }

      if (colDef.formatter && value) {
        return (
          <div className="iot-table-cell" style={{ color }}>
            {icon ? <div className="icon">{getIcons(icon)}</div> : null} {colDef.formatter(value)}
          </div>
        );
      }

      if (typeof value === 'number') {
        return (
          <div className="iot-table-cell" style={{ color }}>
            {icon ? <div className="icon">getIcons(icon)</div> : null} {round(value)}
          </div>
        );
      }
      return (
        <div className="iot-table-cell" style={{ color }}>
          {icon ? <div className="icon">getIcons(icon)</div> : null} {value}
        </div>
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
