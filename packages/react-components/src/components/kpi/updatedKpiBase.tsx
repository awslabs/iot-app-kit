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
import { getAggregationFrequency } from '../../utils/aggregationFrequency';
import { fontSizeBodyS } from '@cloudscape-design/design-tokens';

export const UpdatedKpiBase: React.FC<KPIProperties> = ({
  propertyPoint,
  error,
  resolution,
  aggregationType,
  unit,
  name,
  isLoading,
  settings = {},
  significantDigits,
  isFilledThreshold,
  isThresholdVisible,
}) => {
  const {
    showUnit,
    showName,
    showTimestamp,
    showAggregationAndResolution,
    backgroundColor,
    fontSize,
    secondaryFontSize,
  }: KPISettings = {
    ...DEFAULT_KPI_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  const background =
    !isFilledThreshold && isThresholdVisible ? '#ffffff' : backgroundColor;
  const highContrastFontColor =
    background === '#ffffff' ? '' : highContrastColor(background);
  const fontColor = isFilledThreshold ? highContrastFontColor : '';

  const point = propertyPoint;
  const aggregationResolutionString = getAggregationFrequency(
    resolution,
    aggregationType
  );

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
      className='updated-kpi-container'
      data-testid='kpi-base-component'
      style={{ backgroundColor: background }}
    >
      <div className='updated-kpi'>
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
        {point && (
          <div
            className='timestamp-container'
            style={{
              fontSize: fontSizeBodyS,
              color: fontColor,
            }}
          >
            {showAggregationAndResolution && aggregationResolutionString && (
              <div className='aggregation'>
                {isLoading ? '-' : aggregationResolutionString}
              </div>
            )}
            {showTimestamp && (
              <>
                <div
                  className='timestamp-border'
                  style={{ backgroundColor: fontColor }}
                />
                <div className='timestamp'>
                  {isLoading ? '-' : new Date(point.x).toLocaleString()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {!isFilledThreshold && isThresholdVisible && (
        <div style={{ backgroundColor }} className='kpi-line-threshold' />
      )}
    </div>
  );
};
