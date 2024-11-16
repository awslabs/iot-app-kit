import { useCallback, useMemo, useState } from 'react';
import { parseAlarmStateAssetProperty } from '../../../hooks/useAlarms/transformers';
import { useAlarmsFromQueries } from '../../../hooks/useAlarmsFromQueries/useAlarmsFromQueries';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { type ChartOptions } from '../types';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';
import { type AlarmData } from '../../../hooks/useAlarms';
import { type AlarmContent } from '../../alarm-components/alarm-content/types';
import { mapAlarmRuleExpression } from '../../../hooks/useAlarms/transformers/mapAlarmRuleExpression';
import { toId } from '@iot-app-kit/source-iotsitewise';
import {
  type DataStream,
  type Primitive,
  type Threshold,
  type ThresholdValue,
} from '@iot-app-kit/core';
import { transformAlarmsToThreshold } from '../../../utils/transformAlarmsToThreshold';

type UseChartAlarmOptions = Pick<ChartOptions, 'queries' | 'viewport'>;

export type ChartAlarmEvent = {
  x: number;
  y?: number;
} & AlarmContent;

export type ChartAlarm = {
  assetId?: string;
  propertyId?: string;
  id?: string;
  name?: string;
  events?: ChartAlarmEvent[];
  datastream?: DataStream<Primitive>;
  thresholds?: Threshold<ThresholdValue>;
};

export const useChartAlarms = ({ queries, viewport }: UseChartAlarmOptions) => {
  const transform = useCallback((alarmData: AlarmData): ChartAlarm => {
    const {
      assetId,
      compositeModelId,
      compositeModelName,
      state,
      models,
      inputProperty,
    } = alarmData;
    if (assetId == null || compositeModelId == null || state == null) {
      return {};
    }

    const alarmStateData = state.data ?? [];
    const parsedAlarmStateData: ChartAlarmEvent[] = createNonNullableList(
      alarmStateData.map(parseAlarmStateAssetProperty)
    ).map(
      (point): ChartAlarmEvent => ({
        x: point.timestamp,
        y: point.value.ruleEvaluation?.simpleRule?.inputProperty,
        alarmState: point.value.state,
        alarmName: compositeModelName,
        assetId,
        alarmExpression: mapAlarmRuleExpression(alarmData),
        severity: models?.at(-1)?.severity,
      })
    );

    return {
      assetId,
      propertyId: inputProperty?.at(0)?.property.id,
      id: toId({ assetId, propertyId: compositeModelId }),
      name: compositeModelName,
      events: parsedAlarmStateData,
      datastream: inputProperty?.at(0)?.dataStream,
      thresholds: transformAlarmsToThreshold(alarmData),
    };
  }, []);

  const settings = useMemo(
    () => ({
      fetchInputPropertyData: true,
      fetchThresholds: true,
    }),
    []
  );

  const alarms = useAlarmsFromQueries({
    transform,
    queries,
    viewport,
    settings,
  });

  const [internalAlarmsState, setInternalAlarmsState] = useState(alarms);
  useCustomCompareEffect(
    () => {
      setInternalAlarmsState(alarms);
    },
    [alarms, internalAlarmsState],
    isEqual
  );
  return internalAlarmsState;
};

export type ChartAlarms = ReturnType<typeof useChartAlarms>;
