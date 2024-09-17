import { UseIoTSiteWiseClientOptions } from '../../../requestFunctions/useIoTSiteWiseClient';
import {
  AlarmData,
  UseAlarmsHookSettings,
  UseAlarmsOptions,
} from '../../types';

export type UseAlarmStateOptions = Pick<
  UseIoTSiteWiseClientOptions,
  'iotSiteWiseClient'
> &
  Pick<UseAlarmsHookSettings, 'fetchOnlyLatest' | 'refreshRate'> &
  Pick<UseAlarmsOptions, 'viewport'> & {
    alarms: AlarmData[];
  };
