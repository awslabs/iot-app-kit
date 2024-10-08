import { useCallback, useMemo, useState } from 'react';
import { parseAlarmStateAssetProperty } from '../../../hooks/useAlarms/transformers';
import { useAlarmsFromQueries } from '../../../hooks/useAlarmsFromQueries/useAlarmsFromQueries';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { ChartOptions } from '../types';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';
import { AlarmData } from '../../../hooks/useAlarms';
import { AlarmContent } from '../../alarm-components/alarm-content/types';
import { mapAlarmRuleExpression } from '../../../hooks/useAlarms/transformers/mapAlarmRuleExpression';

type UseChartAlarmOptions = Pick<ChartOptions, 'queries' | 'viewport'>;

export type ChartAlarmEvent = {
  x: number;
  y?: number;
} & AlarmContent;

export const useChartAlarms = ({ queries, viewport }: UseChartAlarmOptions) => {
  const transform = useCallback((alarmData: AlarmData) => {
    const alarmStateData = alarmData.state?.data ?? [];
    const parsedAlarmStateData: ChartAlarmEvent[] = createNonNullableList(
      alarmStateData.map(parseAlarmStateAssetProperty)
    ).map(
      (point): ChartAlarmEvent => ({
        x: point.timestamp,
        y: point.value.ruleEvaluation?.simpleRule?.inputProperty,
        alarmState: point.value.state,
        alarmName: alarmData.compositeModelName,
        assetId: alarmData.assetId,
        alarmExpression: mapAlarmRuleExpression(alarmData),
        severity: alarmData.models?.at(-1)?.severity,
      })
    );

    return {
      assetId: alarmData.assetId,
      propertyId: alarmData.inputProperty?.at(0)?.property.id,
      id: `${alarmData.assetId}---${alarmData.compositeModelId}`,
      name: alarmData.compositeModelName,
      events: parsedAlarmStateData,
      datastream: alarmData.inputProperty?.at(0)?.dataStream,
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
