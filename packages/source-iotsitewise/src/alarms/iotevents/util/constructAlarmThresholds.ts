import { COMPARISON_OPERATOR, Threshold } from '@synchro-charts/core';
import { ALARM_STATUS_MAP, AWSUI_RED_600 } from '../constants';
import { PascalCaseStateName, Alarm } from '../types';
import { toId } from '../../../time-series-data/util/dataStreamId';
import { isNumber } from '../../../common/predicates';

export const constructAlarmThresholds = (alarm: Alarm): Threshold[] => {
  const propertyStreamId = toId({ assetId: alarm.assetId, propertyId: alarm.inputPropertyId });
  const alarmStreamId = toId({ assetId: alarm.assetId, propertyId: alarm.alarmStatePropertyId });

  const alarmStatus = ALARM_STATUS_MAP[alarm.state];

  const inputPropertyThreshold: Threshold = {
    comparisonOperator: alarm.comparisonOperator,
    severity: alarm.severity,
    value: isNumber(alarm.threshold) ? alarm.threshold : parseFloat(alarm.threshold),
    dataStreamIds: [propertyStreamId],
    color: AWSUI_RED_600,
    showValue: true,
    icon: alarmStatus.icon,
    description: alarm.rule,
  };

  const alarmStatePropertyThresholds = Object.keys(ALARM_STATUS_MAP).map((alarmStatus) => {
    const status = ALARM_STATUS_MAP[alarmStatus as PascalCaseStateName];

    return {
      value: alarmStatus,
      color: status.color,
      severity: status.severity,
      icon: status.icon,
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      dataStreamIds: [alarmStreamId],
      description: alarm.rule,
    };
  });

  return [inputPropertyThreshold, ...alarmStatePropertyThresholds];
};
