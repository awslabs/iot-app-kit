import React from 'react';
import omitBy from 'lodash.omitby';

import { DEFAULT_KPI_SETTINGS } from './constants';
import type { KPIBaseProperties, KPISettings } from './types';
import './kpi.css';
import { highContrastColor } from './highContrastColor';
import { getAggregationFrequency } from '../../utils/aggregationFrequency';
import {
  colorBorderDividerSecondary,
  colorTextHeadingDefault,
  fontSizeBodyS,
} from '@cloudscape-design/design-tokens';
import { DEFAULT_DECIMAL_PLACES } from '../../common/constants';
import {
  AggregationResolutionText,
  AlarmHeader,
  DataQuality,
  ErrorText,
  NameAndUnit,
  TimestampText,
  ValueText,
} from './kpiTextFragments';

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
  alarmState,
  alarmStatus,
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

  if (error) {
    return (
      <ErrorText
        {...{
          error,
          secondaryFontSize,
          nonThresholdBackground,
          nonThresholdFontColor,
        }}
      />
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
          <AlarmHeader
            {...{
              fontColor,
              borderColor,
              alarmState,
              alarmStatus,
              showFilledThreshold,
              backgroundColor: settings.backgroundColor,
            }}
          />
          <NameAndUnit
            {...{
              showName,
              name,
              showUnit,
              unit,
              isLoading,
              fontColor,
              secondaryFontSize,
            }}
          />
          <ValueText
            {...{ isLoading, fontSize, fontColor, point, significantDigits }}
          />
          <DataQuality
            {...{
              fontColor,
              showFilledThreshold,
              point,
              backgroundColor: settings.backgroundColor,
              showDataQuality,
              isLoading,
            }}
          />
        </div>
        {point && (
          <div
            className='timestamp-container'
            style={{
              fontSize: fontSizeBodyS,
              color: fontColor,
            }}
          >
            <AggregationResolutionText
              {...{
                showAggregationAndResolution,
                aggregationResolutionString,
                isLoading,
              }}
            />
            <TimestampText
              {...{ showTimestamp, point, borderColor, isLoading, timeZone }}
            />
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
