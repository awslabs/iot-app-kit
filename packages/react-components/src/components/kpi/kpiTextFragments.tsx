import React from 'react';
import Spinner from '@cloudscape-design/components/spinner';
import { Value } from '../shared-components';
import { DataQualityText } from '../data-quality/data-quality-text';
import { formatDate } from '../../utils/time';
import { AlarmStateText } from '../alarm-state/alarm-state-text';
import { PascalCaseStateName } from '../../hooks/useAlarms/transformers';
import { AlarmDataStatus } from '../../hooks/useAlarms';
import type { DataPoint } from '@iot-app-kit/core';
import { Alert, Box } from '@cloudscape-design/components';

export const ErrorText = ({
  secondaryFontSize,
  nonThresholdBackground,
  nonThresholdFontColor,
  error,
}: {
  secondaryFontSize: number;
  nonThresholdBackground: string;
  nonThresholdFontColor: string;
  error?: string;
}) => {
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
};

export const NameAndUnit = ({
  fontColor,
  secondaryFontSize,
  showName,
  name,
  showUnit,
  unit,
  isLoading,
}: {
  fontColor: string;
  secondaryFontSize: number;
  showName?: boolean;
  name?: string;
  showUnit?: boolean;
  unit?: string;
  isLoading?: boolean;
}) => {
  const shouldRenderName = showName && name;
  const shouldRenderUnit = showUnit && unit;

  if ((!shouldRenderName && !shouldRenderUnit) || isLoading) return null;

  return (
    <div
      className='property-name'
      data-testid='kpi-name-and-unit'
      style={{ fontSize: `${secondaryFontSize}px`, color: fontColor }}
    >
      {shouldRenderName && <span>{name} </span>}
      {shouldRenderUnit && <span>{`(${unit})`}</span>}
    </div>
  );
};

export const AlarmHeader = ({
  fontColor,
  borderColor,
  alarmState,
  alarmStatus,
  showFilledThreshold,
  backgroundColor,
}: {
  fontColor: string;
  borderColor: string;
  alarmState?: PascalCaseStateName;
  alarmStatus?: AlarmDataStatus;
  showFilledThreshold?: string;
  backgroundColor?: string;
}) => {
  if (!alarmState && !alarmStatus) return null;

  return (
    <div
      style={{
        padding: '8px',
        borderBottom: `1px solid ${borderColor}`,
        color: fontColor,
      }}
    >
      <AlarmStateText
        state={alarmState}
        status={alarmStatus}
        inheritFontColor={!!showFilledThreshold || !!backgroundColor}
      />
    </div>
  );
};

export const ValueText = ({
  fontSize,
  fontColor,
  significantDigits,
  isLoading,
  point,
}: {
  fontSize: number;
  fontColor: string;
  significantDigits: number;
  isLoading?: boolean;
  point?: DataPoint;
}) => {
  return (
    <div
      className='value'
      data-testid='kpi-value'
      style={{ fontSize: `${fontSize}px`, color: fontColor }}
    >
      {isLoading ? (
        <Spinner data-testid='kpi-loading-spinner' />
      ) : (
        <Value value={point?.y} precision={significantDigits} />
      )}
    </div>
  );
};

export const DataQuality = ({
  fontColor,
  showFilledThreshold,
  point,
  backgroundColor,
  showDataQuality,
  isLoading,
}: {
  fontColor: string;
  showFilledThreshold?: string;
  point?: DataPoint;
  backgroundColor?: string;
  showDataQuality?: boolean;
  isLoading?: boolean;
}) => {
  if (!showDataQuality || isLoading) return null;

  return (
    <div style={{ padding: '0 8px', color: fontColor }}>
      <DataQualityText
        quality={point?.quality}
        inheritFontColor={!!showFilledThreshold || !!backgroundColor}
      />
    </div>
  );
};

export const AggregationResolutionText = ({
  showAggregationAndResolution,
  aggregationResolutionString,
  isLoading,
}: {
  isLoading?: boolean;
  showAggregationAndResolution?: boolean;
  aggregationResolutionString?: string;
}) => {
  if (!showAggregationAndResolution || !aggregationResolutionString)
    return null;
  return (
    <div className='aggregation' data-testid='kpi-aggregation'>
      {!isLoading && aggregationResolutionString}
    </div>
  );
};

export const TimestampText = ({
  borderColor,
  showTimestamp,
  point,
  isLoading,
  timeZone,
}: {
  borderColor: string;
  showTimestamp?: boolean;
  point?: DataPoint;
  isLoading?: boolean;
  timeZone?: string;
}) => {
  if (!showTimestamp || !point) return null;
  return (
    <>
      <div
        className='timestamp-border'
        style={{
          backgroundColor: borderColor,
        }}
      />
      <div className='timestamp' data-testid='kpi-timestamp'>
        {!isLoading &&
          formatDate(point.x, {
            timeZone,
            pattern: 'M/dd/yyyy, h:mm:ss aa',
          })}
      </div>
    </>
  );
};
