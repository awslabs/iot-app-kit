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
  colorBorderDividerSecondary,
  colorTextHeadingDefault,
  fontSizeBodyS,
} from '@cloudscape-design/design-tokens';
import { DataQualityText } from '../data-quality/data-quality-text';
import { DEFAULT_DECIMAL_PLACES } from '../../common/constants';
import { formatDate } from '../../utils/time';
import { Title } from '../../common/title';
import { AlarmStateText } from '../alarm-state/alarm-state-text';

export const KpiBase: React.FC<KPIBaseProperties> = ({
  propertyPoint,
  error,
  resolution,
  aggregationType,
  unit,
  name,
  isLoading,
  settings = {},
  significantDigits = DEFAULT_DECIMAL_PLACES,
  propertyThreshold,
  timeZone,
  titleText,
  alarmState,
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
  const borderColor = showFilledThreshold
    ? highContrastColor(propertyThreshold.color)
    : settings.backgroundColor
    ? nonThresholdFontColor
    : colorBorderDividerSecondary;

  const point = propertyPoint;
  const aggregationResolutionString = getAggregationFrequency(
    resolution,
    aggregationType
  );

  const getTitle = () => {
    if (titleText) {
      return titleText;
    } else {
      const prefix = isLoading ? '-' : showName && name ? name : '';
      const suffix = showUnit && !isLoading && unit ? `(${unit})` : '';
      return `${prefix}${prefix ? ' ' : ''}${suffix}`;
    }
  };

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
        <Title
          data-testid='kpi-name-and-unit'
          text={getTitle()}
          style={{ fontSize: `${secondaryFontSize}px`, color: fontColor }}
        />
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

  const alarmSection = (
    <div
      style={{
        padding: '8px',
        borderBottom: `1px solid ${borderColor}`,
        color: fontColor,
      }}
    >
      <AlarmStateText
        state={alarmState}
        inheritFontColor={!!showFilledThreshold || !!settings.backgroundColor}
      />
    </div>
  );

  const dataQualitySection = (
    <div style={{ padding: '0 8px', color: fontColor }}>
      <DataQualityText
        quality={point?.quality}
        inheritFontColor={!!showFilledThreshold || !!settings.backgroundColor}
      />
    </div>
  );

  return (
    <div
      className='kpi-container'
      data-testid='kpi-base-component'
      style={{ backgroundColor }}
    >
      <div className='kpi'>
        <div>
          {alarmState && alarmSection}
          <Title
            data-testid='kpi-name-and-unit'
            text={getTitle()}
            style={{
              fontSize: `${secondaryFontSize}px`,
              color: fontColor,
              paddingLeft: '0.5rem',
            }}
          />
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
          {!isLoading && showDataQuality && dataQualitySection}
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
                    backgroundColor: borderColor,
                  }}
                />
                <div className='timestamp' data-testid='kpi-timestamp'>
                  {isLoading
                    ? '-'
                    : formatDate(point.x, {
                        timeZone,
                        pattern: 'M/dd/yyyy, h:mm:ss aa',
                      })}
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
