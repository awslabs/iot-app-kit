import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import {
  colorBorderStatusError,
  colorBorderStatusSuccess,
  colorBorderStatusWarning,
  colorTextStatusInactive,
  spaceScaledXxs,
} from '@cloudscape-design/design-tokens';
import { Spinner } from '@cloudscape-design/components';
import {
  type AlarmDataStatus,
  type PascalCaseStateName,
} from '@iot-app-kit/component-core';
import './alarmStateText.css';

export type AlarmStateTextOptions = {
  alarmState?: PascalCaseStateName;
  status?: AlarmDataStatus;
  isLoading?: boolean;
  inheritFontColor?: boolean;
  additionalStyles?: React.CSSProperties;
};

export const AlarmStateText = ({
  alarmState,
  status,
  isLoading,
  inheritFontColor,
  additionalStyles,
}: AlarmStateTextOptions) => {
  let icon = null;
  let text = null;
  let styles: React.CSSProperties = {
    ...additionalStyles,
    gap: spaceScaledXxs,
    textDecoration: 'none',
  };

  let borderBottom = '1px dashed ';

  // checking if the gauge value is loading, so we dont show the alarm loading spinner
  if (isLoading || !alarmState) return null;

  if (status?.isLoading) {
    return <Spinner />;
  }

  switch (alarmState) {
    case 'Active':
      icon = (
        <Icon
          name='notification'
          variant={inheritFontColor ? 'normal' : 'error'}
        />
      );
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-status-error'}>
          Active alarm
        </Box>
      );
      borderBottom += inheritFontColor ? 'inherit' : colorBorderStatusError;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
    case 'Normal':
      icon = (
        <Icon
          name='status-positive'
          variant={inheritFontColor ? 'normal' : 'success'}
        />
      );
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-status-success'}>
          Normal
        </Box>
      );
      borderBottom += inheritFontColor ? 'inherit' : colorBorderStatusSuccess;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
    case 'Latched':
      icon = (
        <Icon
          name='status-warning'
          variant={inheritFontColor ? 'normal' : 'warning'}
        />
      );
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-status-warning'}>
          Latched alarm
        </Box>
      );
      borderBottom += inheritFontColor ? 'inherit' : colorBorderStatusWarning;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
    case 'Acknowledged':
      icon = (
        <Icon
          name='status-in-progress'
          variant={inheritFontColor ? 'normal' : 'subtle'}
        />
      );
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-status-inactive'}>
          Acknowledged alarm
        </Box>
      );
      borderBottom += inheritFontColor ? 'inherit' : colorTextStatusInactive;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
    case 'Disabled':
      icon = (
        <Icon
          name='status-stopped'
          variant={inheritFontColor ? 'normal' : 'subtle'}
        />
      );
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-status-inactive'}>
          Disabled alarm
        </Box>
      );
      borderBottom += inheritFontColor ? 'inherit' : colorTextStatusInactive;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
    case 'SnoozeDisabled':
      icon = (
        <Icon
          name='status-pending'
          variant={inheritFontColor ? 'normal' : 'subtle'}
        />
      );
      text = (
        <Box color={inheritFontColor ? 'inherit' : 'text-status-inactive'}>
          Snoozed alarm
        </Box>
      );
      borderBottom += inheritFontColor ? 'inherit' : colorTextStatusInactive;
      styles = {
        ...styles,
        borderBottom: borderBottom,
      };
      break;
  }

  const alarmStateText = (
    <div
      data-testid='alarm-state-text'
      className='alarm-state alarm-state-text'
    >
      <div className='alarm-state-text' style={styles}>
        {icon}
        {text}
      </div>
    </div>
  );

  return alarmStateText;
};
