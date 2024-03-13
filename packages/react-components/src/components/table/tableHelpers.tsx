import React from 'react';
import { round } from '@iot-app-kit/core-util';
import { STATUS_ICON_TYPE } from '@iot-app-kit/core';
import type { DataPoint } from '@iot-app-kit/core';

import {
  TableProps as CloudscapeTableProps,
  Icon,
} from '@cloudscape-design/components';

import { LoadingSpinner } from './spinner';
import { getIcons } from '../../common/iconUtils';
import type { TableColumnDefinition, TableItemHydrated } from './types';
import {
  colorTextStatusWarning,
  spaceStaticS,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';

const dataQuality = ({ quality }: { quality: DataPoint['quality'] }) => {
  return (
    <span
      style={{
        color: `${colorTextStatusWarning}`,
        borderBottom: `1px dotted ${colorTextStatusWarning}`,
        marginLeft: `${spaceStaticS}`,
      }}
    >
      {quality === 'BAD' && (
        <>
          <Icon name='status-negative' variant='error' />
          <span style={{ marginLeft: `${spaceStaticXxs}` }}>Bad Quality</span>
        </>
      )}
      {quality === 'UNCERTAIN' && (
        <>
          <Icon name='status-warning' variant='warning' />
          <span style={{ marginLeft: `${spaceStaticXxs}` }}>
            Uncertain Quality
          </span>
        </>
      )}
    </span>
  );
};

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

      const { error, isLoading, value, threshold, quality } = item[colDef.key];
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
            data-testid='table-value'
            style={{
              color,
              display: 'flex',
              alignItems: 'center',
              paddingRight: '4px',
            }}
          >
            {icon ? <div className='icon'>{getIcons(icon)}</div> : null}{' '}
            {round(value, precision)}
            {quality && dataQuality({ quality })}
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
          {quality && dataQuality({ quality })}
        </div>
      );
    },
    ...colDef,
    id: colDef.id || colDef.key,
  }));
};
