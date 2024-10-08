import React from 'react';
import { PascalCaseStateName } from '../../../hooks/useAlarms/transformers';
import {
  alarmAcknowledgedIcon,
  alarmActiveIcon,
  alarmDisabledIcon,
  alarmLatchedIcon,
  alarmNormalIcon,
  alarmSnoozedIcon,
} from './alarmIcons';

export const getIconForAlarmState = (
  alarmState?: PascalCaseStateName
): React.JSX.Element | undefined => {
  switch (alarmState) {
    case 'Active':
      return alarmActiveIcon;
    case 'Normal':
      return alarmNormalIcon;
    case 'Latched':
      return alarmLatchedIcon;
    case 'Acknowledged':
      return alarmAcknowledgedIcon;
    case 'Disabled':
      return alarmDisabledIcon;
    case 'SnoozeDisabled':
      return alarmSnoozedIcon;
  }
};
