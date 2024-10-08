import React from 'react';
import { AlarmContent } from '../../../alarm-components/alarm-content/types';
import { AlarmContentContainer } from '../../../alarm-components/alarm-content/alarmContentContainer';

export type XYPlotTooltipAlarmOptions = AlarmContent;

export const XYPlotTooltipAlarm = (alarmContent: XYPlotTooltipAlarmOptions) => {
  return <AlarmContentContainer alarmContent={alarmContent} />;
};
