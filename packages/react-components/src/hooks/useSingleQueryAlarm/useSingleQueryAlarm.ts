import type { Primitive } from '@iot-app-kit/helpers';
import {
  type DataStream,
  type Threshold,
  type ThresholdValue,
  type Viewport,
} from '@iot-app-kit/core';
import isEqual from 'lodash-es/isEqual';
import { useState } from 'react';
import useCustomCompareEffect from 'react-use/esm/useCustomCompareEffect';
import { type ComponentQuery } from '../../common/chartTypes';
import { type AlarmContent } from '../../components/alarm-components/alarm-content/types';
import { transformAlarmsToThreshold } from '../../utils/transformAlarmsToThreshold';
import { type AlarmData, type AlarmDataStatus } from '../useAlarms';
import { parseAlarmStateAssetProperty } from '../useAlarms/transformers';
import { mapAlarmRuleExpression } from '../useAlarms/transformers/mapAlarmRuleExpression';
import { useAlarmsFromQueries } from '../useAlarmsFromQueries';

type UseSingleQueryAlarmOptions = {
  query: ComponentQuery;
  viewport?: Viewport;
};

export type SingleQueryAlarm = {
  alarmContent?: AlarmContent;
  status?: AlarmDataStatus;
  threshold?: Threshold<ThresholdValue>;
  datastream?: DataStream<Primitive>;
};

/**
 * Wrapper for useAlarms that sets up the transform function and memoizes the alarm response.
 *
 * Built for widgets that support a single query like KPI and Gauge.
 *
 * The transform function extracts the alarmContent for connecting with the assistant, the
 * alarm query status, the alarm threshold, and the input property data stream generated
 * internally in useAlarms.
 *
 * @param query is a singled ComponentQuery, which is useable in useAlarms if it is ann AlarmDataQuery
 * @param viewport is the query viewport
 * @returns a SingleQueryAlarm with relevant alarm content
 */
export const useSingleQueryAlarm = ({
  query,
  viewport,
}: UseSingleQueryAlarmOptions): SingleQueryAlarm | undefined => {
  const transform = (alarmData: AlarmData): SingleQueryAlarm => {
    const {
      inputProperty,
      assetId,
      status,
      state,
      compositeModelName,
      models,
    } = alarmData;

    const firstInputProperty = inputProperty?.at(0);
    const latestState = state?.data?.at(-1);

    const severity = models?.at(-1)?.severity;

    return {
      alarmContent: {
        alarmName: compositeModelName,
        alarmExpression: mapAlarmRuleExpression(alarmData),
        assetId,
        alarmState: parseAlarmStateAssetProperty(latestState)?.value.state,
        severity,
      },
      status,
      threshold: transformAlarmsToThreshold(alarmData),
      datastream: firstInputProperty?.dataStream,
    };
  };

  const alarms: SingleQueryAlarm[] = useAlarmsFromQueries({
    transform,
    queries: [query],
    viewport,
    settings: {
      fetchInputPropertyData: true,
      fetchThresholds: true,
      fetchOnlyLatest: true,
    },
  });

  const [internalAlarmsState, setInternalAlarmsState] = useState(alarms);
  useCustomCompareEffect(
    () => {
      setInternalAlarmsState(alarms);
    },
    [alarms, internalAlarmsState],
    isEqual
  );

  // Only return a single alarm
  return internalAlarmsState.at(0);
};

export type BarChartAlarms = ReturnType<typeof useSingleQueryAlarm>;
