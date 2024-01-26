import React from 'react';
import { round } from '@iot-app-kit/core-util';
import { STATUS_ICON_TYPE } from '@iot-app-kit/core';

import { TableProps as CloudscapeTableProps } from '@cloudscape-design/components/table';

import { LoadingSpinner } from './spinner';
import { getIcons } from '../../common/iconUtils';
import type { TableColumnDefinition, TableItemHydrated } from './types';

export const getDefaultColumnDefinitions: (
  columnDefinitions: TableColumnDefinition[],
  precision?: number
) => (CloudscapeTableProps.ColumnDefinition<TableItemHydrated> &
  TableColumnDefinition)[] = (columnDefinitions, precision) => {
  return columnDefinitions.map((colDef) => ({
    cell: (item: TableItemHydrated) => {
      if (!(colDef.key in item)) {
        return '-';
      }

      const { error, isLoading, value, threshold } = item[colDef.key];
      const { color = 'unset', icon } = threshold || {};
      if (error) {
        return (
          <div className='iot-table-cell'>
            <div className='icon'>{getIcons(STATUS_ICON_TYPE.error)}</div>{' '}
            {error.msg}
          </div>
        );
      }

      if (isLoading) {
        return <LoadingSpinner size={16} />;
      }

      if (colDef.formatter && value) {
        return (
          <div className='iot-table-cell' style={{ color }}>
            {icon ? <div className='icon'>{getIcons(icon)}</div> : null}{' '}
            {colDef.formatter(value)}
          </div>
        );
      }

      if (typeof value === 'number') {
        return (
          <div
            className='iot-table-cell'
            style={{
              color,
              display: 'flex',
              alignItems: 'center',
              paddingRight: '4px',
            }}
          >
            {icon ? <div className='icon'>{getIcons(icon)}</div> : null}{' '}
            {round(value, precision)}
          </div>
        );
      }
      return (
        <div
          className='iot-table-cell'
          style={{
            color,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon ? <div className='icon'>{getIcons(icon)}</div> : null} {value}
        </div>
      );
    },
    ...colDef,
    id: colDef.id || colDef.key,
  }));
};
