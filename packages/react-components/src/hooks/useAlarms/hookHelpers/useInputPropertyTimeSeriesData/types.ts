import { AlarmDataQuery } from '@iot-app-kit/source-iotsitewise';
import {
  AlarmData,
  UseAlarmsHookSettings,
  UseAlarmsInputPropertyTimeSeriesDataSettings,
  UseAlarmsOptions,
} from '../../types';
import { OnUpdateAlarmInputDataAction } from '../../state';

export type UseInputPropertyTimeSeriesDataOptions = {
  timeSeriesData?: AlarmDataQuery['timeSeriesData'];
} & Pick<
  UseAlarmsHookSettings,
  'fetchInputPropertyData' | 'fetchOnlyLatest' | 'refreshRate'
> &
  Pick<UseAlarmsOptions, 'viewport'> & {
    requests: Pick<AlarmData, 'assetId' | 'inputProperty'>[];
  } & UseAlarmsInputPropertyTimeSeriesDataSettings & {
    onUpdateAlarmInputPropertyData: OnUpdateAlarmInputDataAction;
  };
