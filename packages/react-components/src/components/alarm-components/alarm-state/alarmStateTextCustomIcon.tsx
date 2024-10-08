import React from 'react';
import { PascalCaseStateName } from '../../../hooks/useAlarms/transformers';
import { getIconForAlarmState } from '../alarm-icons/getIconForAlarmState';
import { spaceScaledXxs } from '@cloudscape-design/design-tokens';
import { Box } from '@cloudscape-design/components';

export type AlarmStateTextCustomIconOptions = {
  alarmState?: PascalCaseStateName;
  alarmName?: string;
};

export const AlarmStateTextCustomIcon = ({
  alarmState,
  alarmName,
}: AlarmStateTextCustomIconOptions) => {
  const icon = getIconForAlarmState(alarmState);

  const styles: React.CSSProperties = {
    display: 'flex',
    gap: spaceScaledXxs,
    textDecoration: 'none',
  };

  const text = <Box fontWeight='bold'>{alarmName}</Box>;

  const alarmStateText = (
    <div
      data-testid='custom-alarm-state-text'
      className='alarm-state custom-alarm-state-text'
    >
      <div className='custom-alarm-state-text' style={styles}>
        {icon}
        {text}
      </div>
    </div>
  );

  return alarmStateText;
};
