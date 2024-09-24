import { AlarmDataQuery } from '@iot-app-kit/source-iotsitewise';
import {
  AlarmData,
  UseAlarmsHookSettings,
  UseAlarmsInputPropertyTimeSeriesDataSettings,
  UseAlarmsOptions,
} from '../../types';

export type UseInputPropertyTimeSeriesDataOptions = {
  timeSeriesData?: AlarmDataQuery['timeSeriesData'];
} & Pick<
  UseAlarmsHookSettings,
  'fetchInputPropertyData' | 'fetchOnlyLatest' | 'refreshRate'
> &
  Pick<UseAlarmsOptions, 'viewport'> & {
    alarms: AlarmData[];
  } & UseAlarmsInputPropertyTimeSeriesDataSettings;
