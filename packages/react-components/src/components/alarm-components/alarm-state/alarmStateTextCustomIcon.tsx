import { type PascalCaseStateName } from '@iot-app-kit/component-core';
import { type CSSProperties } from 'react';
import { getIconForAlarmState } from '../alarm-icons/getIconForAlarmState';
import { spaceScaledXxs } from '@cloudscape-design/design-tokens';
import { Box } from '@cloudscape-design/components';

const styles = {
  display: 'flex',
  gap: spaceScaledXxs,
  textDecoration: 'none',
} satisfies CSSProperties;

export interface AlarmStateTextCustomIconProps {
  alarmState?: PascalCaseStateName;
  alarmName?: string;
}

export const AlarmStateTextCustomIcon = ({
  alarmState,
  alarmName,
}: AlarmStateTextCustomIconProps) => {
  const icon = getIconForAlarmState(alarmState);

  const text = <Box fontWeight='bold'>{alarmName}</Box>;

  return (
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
};
