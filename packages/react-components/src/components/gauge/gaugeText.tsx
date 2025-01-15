// eslint-disable-next-line import/default
import { type Quality } from '@aws-sdk/client-iotsitewise';
import { DataQualityText } from '../data-quality/data-quality-text';
import { type GaugeSettings } from './types';
import {
  colorTextBodyDefault,
  colorTextHeadingDefault,
} from '@cloudscape-design/design-tokens';
import { AlarmStateTextWithAssistant } from '../alarm-components/alarm-state/alarmStateTextWithAssistant';
import { AlarmStateText } from '../alarm-components/alarm-state/alarmStateText';
import { getPreciseValue } from '../../utils/getPreciseValue';
import { type Primitive } from '@iot-app-kit/core';
import { GaugeErrorText } from './gaugeErrorText';
import { type AlarmContent } from '../alarm-components/alarm-content/types';
import { type AssistantProperty } from '../../common/assistantProps';
import { type AlarmDataStatus } from '../../hooks/useAlarms';
import { Spinner } from '@cloudscape-design/components';

const getFormattedValue = ({
  value,
  unit,
  valueColor,
  significantDigits,
  fontSize,
  unitFontSize,
  showUnit,
  isLoading,
}: {
  value?: Primitive;
  valueColor?: string;
  significantDigits?: number;
  unit?: string;
  fontSize?: number;
  unitFontSize?: number;
  showUnit?: boolean;
  isLoading?: boolean;
}) => {
  if (!value) return null;

  if (isLoading) return <Spinner data-testid='loading' />;

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
  alarmContent,
  alarmStatus,
  valueColor,
  significantDigits,
  settings,
  titleText,
  error,
  assistant,
  isLoading,
}: {
  value?: Primitive;
  error?: string;
  quality?: Quality;
  name?: string;
  unit?: string;
  valueColor?: string;
  alarmContent?: AlarmContent;
  alarmStatus?: AlarmDataStatus;
  settings?: GaugeSettings;
  titleText?: string;
  significantDigits?: number;
  isLoading?: boolean;
  assistant?: AssistantProperty;
}) => {
  const hasVisibleName = settings?.showName && name;
  const hasVisibleQuality = quality && quality !== 'GOOD';

  return (
    <div
      className='gauge-text-container'
      style={{
        bottom:
          (hasVisibleName && hasVisibleQuality) || titleText ? '8%' : '20%',
      }}
    >
      <div
        className='gauge-info-text'
        style={{
          color: colorTextHeadingDefault,
          fontSize: settings?.labelFontSize,
        }}
      >
        <GaugeErrorText error={error} />
        {assistant ? (
          <AlarmStateTextWithAssistant
            status={alarmStatus}
            alarmContent={alarmContent}
            isLoading={isLoading}
            assistant={assistant}
          />
        ) : (
          <AlarmStateText
            status={alarmStatus}
            alarmState={alarmContent?.alarmState}
            isLoading={isLoading}
          />
        )}
        {!error &&
          getFormattedValue({
            value,
            unit,
            valueColor,
            fontSize: settings?.fontSize,
            unitFontSize: settings?.unitFontSize,
            showUnit: settings?.showUnit,
            significantDigits,
            isLoading: isLoading,
          })}
        {!isLoading && hasVisibleName && (
          <div className='gauge-property-name'>{name}</div>
        )}
        {!isLoading && hasVisibleQuality && (
          <DataQualityText quality={quality} />
        )}
      </div>
    </div>
  );
};
