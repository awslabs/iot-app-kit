import React from 'react';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import omitBy from 'lodash.omitby';

import { DEFAULT_KPI_SETTINGS } from './constants';
import { Value } from '../shared-components';
import type { KPIProperties, KPISettings } from './types';
import './kpi.css';
import { highContrastColor } from '../status/highContrastColor';

export const UpdatedKpiBase: React.FC<KPIProperties> = ({
  propertyPoint,
  error,
  unit,
  name,
  isLoading,
  settings = {},
  significantDigits,
}) => {
  const {
    showUnit,
    showName,
    showTimestamp,
    backgroundColor,
    fontSize,
    secondaryFontSize,
  }: KPISettings = {
    ...DEFAULT_KPI_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  const point = propertyPoint;
  const fontColor =
    backgroundColor === '#ffffff' ? '' : highContrastColor(backgroundColor);

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
    <div
      className='updated-kpi'
      data-testid='kpi-base-component'
      style={{ backgroundColor }}
    >
      <div>
        <div
          className='property-name'
          style={{ fontSize: `${secondaryFontSize}px`, color: fontColor }}
        >
          {isLoading ? '-' : showName && name}{' '}
          {showUnit && !isLoading && unit && `(${unit})`}
        </div>
        <div
          className='value'
          data-testid='kpi-value'
          style={{ fontSize: `${fontSize}px`, color: fontColor }}
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
          style={{ fontSize: `${secondaryFontSize}px`, color: fontColor }}
        >
          <div
            className='timestamp-border'
            style={{ backgroundColor: fontColor }}
          />
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
