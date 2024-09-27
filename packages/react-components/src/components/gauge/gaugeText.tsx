// eslint-disable-next-line import/default
import React from 'react';
import { Quality } from '@aws-sdk/client-iotsitewise';
import { DataQualityText } from '../data-quality/data-quality-text';
import { GaugeSettings } from './types';
import {
  colorTextBodyDefault,
  colorTextHeadingDefault,
} from '@cloudscape-design/design-tokens';
import { AlarmStateText } from '../alarm-state/alarm-state-text';
import { PascalCaseStateName } from '../../hooks/useAlarms/transformers';
import { getPreciseValue } from '../../utils/getPreciseValue';
import { Primitive } from '@iot-app-kit/core';

const getFormattedValue = ({
  value,
  unit,
  valueColor,
  significantDigits,
  fontSize,
  unitFontSize,
  showUnit,
}: {
  value?: Primitive;
  valueColor?: string;
  significantDigits?: number;
  unit?: string;
  fontSize?: number;
  unitFontSize?: number;
  showUnit?: boolean;
}) => {
  if (!value) return '-';

  return (
    <div
      className='formatted-gauge-value'
      style={{ color: valueColor ?? colorTextBodyDefault }}
    >
      <span style={{ fontSize, fontWeight: 'bolder' }}>
        {getPreciseValue(value, significantDigits)}
      </span>
      {showUnit && (
        <span style={{ fontSize: unitFontSize, fontWeight: 'bolder' }}>
          {unit}
        </span>
      )}
    </div>
  );
};

export const GaugeText = ({
  quality,
  name,
  value,
  unit,
  alarmState,
  valueColor,
  significantDigits,
  settings,
}: {
  value?: Primitive;
  error?: string;
  quality?: Quality;
  name?: string;
  unit?: string;
  valueColor?: string;
  alarmState?: PascalCaseStateName;
  settings?: GaugeSettings;
  significantDigits?: number;
  isLoading?: boolean;
}) => {
  const hasVisibleName = settings?.showName && name;
  const hasVisibleQuality = quality && quality !== 'GOOD';

  return (
    <div className='gauge-text-container'>
      <div
        className='gauge-info-text'
        style={{
          color: colorTextHeadingDefault,
          fontSize: settings?.labelFontSize,
        }}
      >
        {alarmState && <AlarmStateText state={alarmState} />}
        {getFormattedValue({
          value,
          unit,
          valueColor,
          fontSize: settings?.fontSize,
          unitFontSize: settings?.unitFontSize,
          showUnit: settings?.showUnit,
          significantDigits,
        })}
        {hasVisibleName && <div className='gauge-property-name'>{name}</div>}
        {hasVisibleQuality && <DataQualityText quality={quality} />}
      </div>
    </div>
  );
};
