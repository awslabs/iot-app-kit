import { getAlarmStreamThresholds } from './getAlarmStreamThresholds';
import type { Threshold, TimeSeriesData } from '@iot-app-kit/core';

const TIME_SERIES_DATA_WITH_ALARMS = {
  thresholds: [
    {
      color: '#d13212',
      comparisonOperator: 'GT',
      dataStreamIds: ['alarm-asset-id---input-property-id'],
      description: 'inputProperty > 30',
      icon: 'active',
      severity: 1,
      showValue: true,
      value: 30,
    },
    {
      color: '#d13212',
      comparisonOperator: 'EQ',
      dataStreamIds: ['alarm-asset-id---alarm-state-property-id'],
      description: 'inputProperty > 30',
      icon: 'active',
      severity: 1,
      value: 'Active',
    },
    {
      color: '#f89256',
      comparisonOperator: 'EQ',
      dataStreamIds: ['alarm-asset-id---alarm-state-property-id'],
      description: 'inputProperty > 30',
      icon: 'latched',
      severity: 2,
      value: 'Latched',
    },
    {
      color: '#3184c2',
      comparisonOperator: 'EQ',
      dataStreamIds: ['alarm-asset-id---alarm-state-property-id'],
      description: 'inputProperty > 30',
      icon: 'acknowledged',
      severity: 3,
      value: 'Acknowledged',
    },
    {
      color: '#1d8102',
      comparisonOperator: 'EQ',
      dataStreamIds: ['alarm-asset-id---alarm-state-property-id'],
      description: 'inputProperty > 30',
      icon: 'normal',
      severity: 4,
      value: 'Normal',
    },
    {
      color: '#879596',
      comparisonOperator: 'EQ',
      dataStreamIds: ['alarm-asset-id---alarm-state-property-id'],
      description: 'inputProperty > 30',
      icon: 'snoozed',
      severity: 5,
      value: 'SnoozeDisabled',
    },
    {
      color: '#687078',
      comparisonOperator: 'EQ',
      dataStreamIds: ['alarm-asset-id---alarm-state-property-id'],
      description: 'inputProperty > 30',
      icon: 'disabled',
      severity: 6,
      value: 'Disabled',
    },
  ],
  dataStreams: [
    {
      id: 'alarm-asset-id---alarm-state-property-id',
      streamType: 'ALARM',
      name: 'AWS/ALARM_STATE',
      resolution: 0,
      refId: undefined,
      isRefreshing: false,
      isLoading: false,
      error: undefined,
      dataType: 'NUMBER',
      aggregates: {},
      data: [
        {
          x: 1000000,
          y: 'Active',
        },
        {
          x: 2000000,
          y: 'Normal',
        },
      ],
    },
  ],
  viewport: {
    duration: '5m',
  },
} as TimeSeriesData;

it('should return alarm stream annotations', () => {
  const { thresholds, dataStreams } = TIME_SERIES_DATA_WITH_ALARMS;

  const ALARM_STREAM_ANNOTATIONS = thresholds.filter((yAnnotation) => {
    return (yAnnotation as unknown as Threshold)!.dataStreamIds!.includes('alarm-asset-id---alarm-state-property-id');
  });

  expect(getAlarmStreamThresholds({ thresholds, dataStreams })).toEqual(ALARM_STREAM_ANNOTATIONS);
});
