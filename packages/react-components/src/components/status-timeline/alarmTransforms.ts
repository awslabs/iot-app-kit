import {
  COMPARISON_OPERATOR,
  type DataPoint,
  type DataStream,
} from '@iot-app-kit/core';
import type { AlarmData } from '../../hooks/useAlarms';
import {
  parseAlarmStateAssetProperty,
  type PascalCaseStateName,
} from '../../hooks/useAlarms/transformers';
import { CHART_ALARM_ERROR } from '../../common/constants';

export const transformAlarmStateToDataStream = (
  alarm: AlarmData
): DataStream<PascalCaseStateName> => {
  const data = (
    alarm.state?.data?.map((d) => {
      const parsedData = parseAlarmStateAssetProperty(d);
      if (parsedData) {
        return {
          x: parsedData?.timestamp,
          y: parsedData?.value.state,
          quality: parsedData?.quality,
        };
      }
    }) ?? []
  ).filter((point) => !!point) as DataPoint<PascalCaseStateName>[];

  const firstInputProperty = alarm.inputProperty?.at(0)?.property;

  return {
    id: `${alarm.assetId}---${alarm.compositeModelId}---state`,
    data: data,
    name: alarm.compositeModelName,
    isLoading: alarm.status.isLoading,
    isRefreshing: alarm.status.isRefetching,
    assetName: firstInputProperty?.name,
    error: alarm.status.isError ? CHART_ALARM_ERROR : undefined,
    resolution: 0,
  };
};

export const ALARM_STATE_THRESHOLDS = [
  {
    color: '#D13112',
    value: 'Active',
    comparisonOperator: COMPARISON_OPERATOR.EQ,
  },
  {
    color: '#1E8102',
    value: 'Normal',
    comparisonOperator: COMPARISON_OPERATOR.EQ,
  },
  {
    color: '#F89256',
    value: 'Latched',
    comparisonOperator: COMPARISON_OPERATOR.EQ,
  },
  {
    color: '#697078',
    value: 'Disabled',
    comparisonOperator: COMPARISON_OPERATOR.EQ,
  },
  {
    color: '#3184C2',
    value: 'Acknowledged',
    comparisonOperator: COMPARISON_OPERATOR.EQ,
  },
  {
    color: '#879596',
    value: 'SnoozeDisabled',
    comparisonOperator: COMPARISON_OPERATOR.EQ,
  },
];
