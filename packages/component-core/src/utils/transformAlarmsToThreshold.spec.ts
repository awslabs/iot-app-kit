import { COMPARISON_OPERATOR } from '@iot-app-kit/core';
import {
  MOCK_ALARM_INPUT_PROPERTY_NAME,
  mockAlarmDataDescribeAlarmModel,
  mockAlarmDataDescribeAsset,
  mockAlarmDataWithThresholds,
  mockAlarmModel,
  mockThresholdAssetProperty,
} from '../testing/alarms';
import { transformAlarmsToThreshold } from './transformAlarmsToThreshold';
import { COMPARISON_OPERATOR_TEXT_LABEL_MAP } from '../common/constants';
import { type AlarmData } from '../hooks/useAlarms';
import { DATA_STREAM } from '../testing/mockWidgetProperties';

describe('transformAlarmsToThreshold', () => {
  it('should not return thresholds without alarm models', () => {
    expect(
      transformAlarmsToThreshold(mockAlarmDataDescribeAsset)
    ).not.toBeDefined();
  });

  it('should not return thresholds without alarm thresholds', () => {
    expect(
      transformAlarmsToThreshold(mockAlarmDataDescribeAlarmModel)
    ).not.toBeDefined();
  });

  it('should return threshold when alarmData has models, inputProperty, and thresholds', () => {
    const alarmThreshold = transformAlarmsToThreshold(
      mockAlarmDataWithThresholds
    );
    expect(alarmThreshold).toBeDefined();
    expect(alarmThreshold?.value).toBe(
      mockThresholdAssetProperty.value?.doubleValue
    );
    expect(alarmThreshold?.severity).toBe(mockAlarmModel.severity);
    expect(alarmThreshold?.label?.text).toContain(
      MOCK_ALARM_INPUT_PROPERTY_NAME
    );
    expect(alarmThreshold?.label?.text).toContain(
      COMPARISON_OPERATOR_TEXT_LABEL_MAP.GT
    );
    expect(alarmThreshold?.label?.text).toContain(
      mockThresholdAssetProperty.value?.doubleValue?.toString()
    );
    expect(alarmThreshold?.comparisonOperator).toBe(COMPARISON_OPERATOR.GT);
  });

  it('should return threshold mapped to inputProperty dataStream', () => {
    const mockAlarmData = {
      ...mockAlarmDataWithThresholds,
      inputProperty: [
        {
          ...mockAlarmDataWithThresholds.inputProperty[0],
          dataStream: DATA_STREAM,
        },
      ],
    } satisfies AlarmData;
    const alarmThreshold = transformAlarmsToThreshold(mockAlarmData);
    expect(alarmThreshold).toBeDefined();
    expect(alarmThreshold?.dataStreamIds).toStrictEqual([DATA_STREAM.id]);
  });
});
