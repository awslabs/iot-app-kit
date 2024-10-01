import { useCallback, useMemo, useState } from 'react';
import { parseAlarmStateAssetProperty } from '../../../hooks/useAlarms/transformers';
import { useAlarmsFromQueries } from '../../../hooks/useAlarmsFromQueries/useAlarmsFromQueries';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { ChartOptions } from '../types';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';
import { AlarmData } from '../../../hooks/useAlarms';

type UseChartAlarmOptions = Pick<ChartOptions, 'queries' | 'viewport'>;

export const useChartAlarms = ({ queries, viewport }: UseChartAlarmOptions) => {
  const transform = useCallback((alarmData: AlarmData) => {
    const alarmStateData = alarmData.state?.data ?? [];
    const parsedAlarmStateData = createNonNullableList(
      alarmStateData.map(parseAlarmStateAssetProperty)
    ).map((point) => ({
      x: point.timestamp,
      y: point.value.ruleEvaluation?.simpleRule?.inputProperty,
      alarmState: point.value.state,
    }));

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
