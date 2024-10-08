import React from 'react';
import {
  ALARM_ACKNOWLEDGED_ICON,
  ALARM_ACKNOWLEDGED_ICON_COLOR,
  ALARM_ACTIVE_ICON,
  ALARM_ACTIVE_ICON_COLOR,
  ALARM_DISABLED_ICON,
  ALARM_DISABLED_ICON_COLOR,
  ALARM_LATCHED_ICON,
  ALARM_LATCHED_ICON_COLOR,
  ALARM_NORMAL_ICON,
  ALARM_NORMAL_ICON_COLOR,
  ALARM_SNOOZED_ICON,
  ALARM_SNOOZED_ICON_COLOR,
} from '../../chart/eChartsConstants';

export const alarmNormalIcon = (
  <img
    src={ALARM_NORMAL_ICON}
    color={ALARM_NORMAL_ICON_COLOR}
    width='20'
    height='20'
    alt='SiteWise Alarm Normal Icon'
  />
);

export const alarmActiveIcon = (
  <img
    src={ALARM_ACTIVE_ICON}
    color={ALARM_ACTIVE_ICON_COLOR}
    width='20'
    height='20'
    alt='SiteWise Alarm Active Icon'
  />
);

export const alarmAcknowledgedIcon = (
  <img
    src={ALARM_ACKNOWLEDGED_ICON}
    color={ALARM_ACKNOWLEDGED_ICON_COLOR}
    width='20'
    height='20'
    alt='SiteWise Alarm Acknowledged Icon'
  />
);

export const alarmLatchedIcon = (
  <img
    src={ALARM_LATCHED_ICON}
    color={ALARM_LATCHED_ICON_COLOR}
    width='20'
    height='20'
    alt='SiteWise Alarm Latched Icon'
  />
);

export const alarmDisabledIcon = (
  <img
    src={ALARM_DISABLED_ICON}
    color={ALARM_DISABLED_ICON_COLOR}
    width='20'
    height='20'
    alt='SiteWise Alarm Disabled Icon'
  />
);

export const alarmSnoozedIcon = (
  <img
    src={ALARM_SNOOZED_ICON}
    color={ALARM_SNOOZED_ICON_COLOR}
    width='20'
    height='20'
    alt='SiteWise Alarm Snoozed Icon'
  />
);
