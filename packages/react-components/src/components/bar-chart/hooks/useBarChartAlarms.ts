import {
  type DataStream,
  type Primitive,
  type ResolutionConfig,
  type Threshold,
  type ThresholdValue,
} from '@iot-app-kit/core';
import { toId } from '@iot-app-kit/source-iotsitewise';
import isEqual from 'lodash-es/isEqual';
import { useState } from 'react';
import { useCustomCompareEffect } from 'react-use';
import { type AlarmData } from '../../../hooks/useAlarms';
import { useAlarmsFromQueries } from '../../../hooks/useAlarmsFromQueries';
import { transformAlarmsToThreshold } from '../../../utils/transformAlarmsToThreshold';
import { type BarChartProps } from '../barChart';

type UseBarChartAlarmOptions = Pick<BarChartProps, 'queries' | 'viewport'> & {
  resolutionConfig?: ResolutionConfig;
};

type BarChartAlarm = {
  thresholds?: Threshold<ThresholdValue>;
  datastream?: DataStream<Primitive>;
  assetId?: string;
  propertyId?: string;
  id?: string;
};

export const useBarChartAlarms = ({
  queries,
  viewport,
  resolutionConfig,
}: UseBarChartAlarmOptions): BarChartAlarm[] => {
  const transform = (alarmData: AlarmData): BarChartAlarm => {
    const { assetId, inputProperty, compositeModelId } = alarmData;
    if (assetId == null || compositeModelId == null || inputProperty == null) {
      return {};
    }

    return {
      assetId,
      propertyId: inputProperty?.at(0)?.property.id,
      id: toId({ assetId, propertyId: compositeModelId }),
      thresholds: transformAlarmsToThreshold(alarmData),
      datastream: inputProperty?.at(0)?.dataStream,
    };
  };

  const alarms: BarChartAlarm[] = useAlarmsFromQueries({
    transform,
    queries,
    viewport,
    settings: {
      fetchInputPropertyData: true,
      fetchThresholds: true,
    },
    inputPropertyTimeSeriesDataSettings: {
      resolutionConfig,
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
  return internalAlarmsState;
};

export type BarChartAlarms = ReturnType<typeof useBarChartAlarms>;
