import { type AlarmDataQuery } from '@iot-app-kit/source-iotsitewise';
import {
  type AlarmData,
  type UseAlarmsHookSettings,
  type UseAlarmsInputPropertyTimeSeriesDataSettings,
  type UseAlarmsOptions,
} from '../../types';
import { type OnUpdateAlarmInputDataAction } from '../../state';

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
