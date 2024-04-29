import React from 'react';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import omitBy from 'lodash.omitby';

import { DEFAULT_KPI_SETTINGS } from './constants';
import { Value } from '../shared-components';
import type { KPIBaseProperties, KPISettings } from './types';
import './kpi.css';
import { highContrastColor } from './highContrastColor';
import { getAggregationFrequency } from '../../utils/aggregationFrequency';
import {
  colorTextHeadingDefault,
  fontSizeBodyS,
} from '@cloudscape-design/design-tokens';
import { DataQualityText } from '../data-quality/data-quality-text';

export const KpiBase: React.FC<KPIBaseProperties> = ({
  propertyPoint,
  error,
  resolution,
  aggregationType,
  unit,
  name,
  isLoading,
  settings = {},
  significantDigits,
  propertyThreshold,
}) => {
  const {
    showUnit,
    showName,
    showTimestamp,
    showDataQuality,
    showAggregationAndResolution,
    fontSize,
    secondaryFontSize,
  }: KPISettings = {
    ...DEFAULT_KPI_SETTINGS,
    ...omitBy(settings, (x) => x == null),
  };

  const showFilledThreshold =
    propertyThreshold?.fill && propertyThreshold?.color;
  const nonThresholdBackground = settings.backgroundColor
    ? settings.backgroundColor
    : DEFAULT_KPI_SETTINGS.backgroundColor;
  const nonThresholdFontColor = settings.backgroundColor
    ? highContrastColor(nonThresholdBackground)
    : colorTextHeadingDefault;

  const backgroundColor = showFilledThreshold
    ? propertyThreshold.color
    : nonThresholdBackground;
  const fontColor = showFilledThreshold
    ? highContrastColor(propertyThreshold.color)
    : nonThresholdFontColor;

  const point = propertyPoint;
  const aggregationResolutionString = getAggregationFrequency(
    resolution,
    aggregationType
  );

  if (error) {
    return (
      <div
        className='kpi'
        data-testid='kpi-error-component'
        style={{
          fontSize: `${secondaryFontSize}px`,
          backgroundColor: nonThresholdBackground,
          color: nonThresholdFontColor,
        }}
      >
        {error && (
          <Box margin={{ vertical: 's', horizontal: 's' }}>
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
      className='kpi-container'
      data-testid='kpi-base-component'
      style={{ backgroundColor }}
    >
      <div className='kpi'>
        <div>
          <div
            className='property-name'
            data-testid='kpi-name-and-unit'
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
          {!isLoading && showDataQuality && (
            <DataQualityText quality={point?.quality} />
          )}
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
              <div className='aggregation' data-testid='kpi-aggregation'>
                {isLoading ? '-' : aggregationResolutionString}
              </div>
            )}
            {showTimestamp && (
              <>
                <div
                  className='timestamp-border'
                  style={{
                    backgroundColor: fontColor,
                  }}
                />
                <div className='timestamp' data-testid='kpi-timestamp'>
                  {isLoading ? '-' : new Date(point.x).toLocaleString()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {!propertyThreshold?.fill && propertyThreshold?.color && (
        <div
          data-testid='kpi-side-threshold'
          style={{ backgroundColor: propertyThreshold?.color }}
          className='kpi-line-threshold'
        />
      )}
    </div>
  );
};
