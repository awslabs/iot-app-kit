import React from 'react';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import omitBy from 'lodash.omitby';

import {
  DEFAULT_KPI_SETTINGS,
  DEFAULT_KPI_COLOR,
  KPI_ICON_SHRINK_FACTOR,
} from './constants';
import { StatusIcon, Value } from '../shared-components';
import type { KPIProperties, KPISettings } from './types';
import './kpi.css';

export const UpdatedKpiBase: React.FC<KPIProperties> = ({
  icon,
  propertyPoint,
  error,
  unit,
  name,
  isLoading,
  color = DEFAULT_KPI_COLOR,
  settings = {},
  significantDigits,
}) => {
  const {
    showUnit,
    showIcon,
    showName,
    showTimestamp,
    fontSize,
    secondaryFontSize,
  }: KPISettings = {
    ...DEFAULT_KPI_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  const point = propertyPoint;

  if (error) {
    return (
      <div
        className='kpi'
        data-testid='kpi-base-component'
        style={{ fontSize: `${secondaryFontSize}px` }}
      >
        {error && (
          <Box margin={{ vertical: 's' }}>
            <Alert statusIconAriaLabel='Error' type='error'>
              {error}
            </Alert>
          </Box>
        )}
      </div>
    );
  }

  return (
    <div className='updated-kpi' data-testid='kpi-base-component'>
      <div>
        {showIcon && icon && (
          <StatusIcon
            name={icon}
            size={fontSize * KPI_ICON_SHRINK_FACTOR}
            color={color}
          />
        )}
        <div
          className='property-name'
          style={{ fontSize: `${secondaryFontSize}px` }}
        >
          {isLoading ? '-' : showName && name}{' '}
          {showUnit && !isLoading && `(${unit})`}
        </div>
        {/* <div
          className='asset-name'
          style={{ fontSize: `${secondaryFontSize}px` }}
        >
          {isLoading ? '-' : assetName && assetName}
        </div> */}
        <div
          className='value'
          data-testid='kpi-value'
          style={{ fontSize: `${fontSize}px` }}
        >
          {isLoading ? (
            <Spinner data-testid='loading' />
          ) : (
            <Value value={point?.y} precision={significantDigits} />
          )}
        </div>
      </div>
      {point && showTimestamp && (
        <div
          className='timestamp-container'
          style={{ fontSize: `${secondaryFontSize}px` }}
        >
          <div className='timestamp-border' />
          {isLoading ? (
            '-'
          ) : (
            <div className='timestamp'>
              {new Date(point.x).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
