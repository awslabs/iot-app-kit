import { useMemo, useState } from 'react';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';

import { AlarmData } from '../../types';
import { UseInputPropertyTimeSeriesDataOptions } from './types';
import { useTimeSeriesDataQueries } from './useTimeSeriesDataQueries';
import { updateAlarmStatusForDatastreams } from './updateAlarmStatusForDatastreams';
import { updateAlarmInputPropertyData } from './updateAlarmInputPropertyData';
import { filterDataStreamsForAlarm } from './filterDatastreamsForAlarm';

import { useTimeSeriesData } from '../../../useTimeSeriesData';

const alarmDataAsComparable = ({ inputProperty, assetId }: AlarmData) =>
  inputProperty?.map(({ property }) => ({ assetId, propertyId: property.id }));

export const useInputPropertyTimeSeriesData = ({
  alarms,
  viewport,
  fetchOnlyLatest,
  refreshRate,
  ...queryOptions
}: UseInputPropertyTimeSeriesDataOptions) => {
  const [alarmsInternal, setAlarmsInternal] = useState<AlarmData[]>(alarms);

  /**
   * Alarm data can change, we only want to update the
   * timeSeriesData queries if the input properties property
   * have changed between renders.
   */
  useCustomCompareEffect(
    () => {
      setAlarmsInternal(alarms);
    },
    [alarms],
    ([prevAlarms], [nextAlarms]) => {
      return isEqual(
        prevAlarms.map(alarmDataAsComparable),
        nextAlarms.map(alarmDataAsComparable)
      );
    }
  );

  const queries = useTimeSeriesDataQueries({
    alarms: alarmsInternal,
    viewport,
    ...queryOptions,
  });

  const { dataStreams } = useTimeSeriesData({
    queries,
    viewport,
    settings: {
      refreshRate,
      fetchFromStartToEnd: !fetchOnlyLatest,
      fetchMostRecentBeforeEnd: !!fetchOnlyLatest,
    },
  });

  return useMemo(() => {
    return alarms.map((alarm) => {
      const datastreamsForAlarm = filterDataStreamsForAlarm(alarm, dataStreams);

      updateAlarmStatusForDatastreams(alarm, datastreamsForAlarm);

      updateAlarmInputPropertyData(alarm, datastreamsForAlarm);

      return alarm;
    });
  }, [alarms, dataStreams]);
};
