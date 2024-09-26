import React from 'react';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import {
  colorBorderStatusError,
  colorBorderStatusSuccess,
  colorBorderStatusWarning,
  colorTextStatusInactive,
  spaceScaledXxs,
} from '@cloudscape-design/design-tokens';

import './alarm-state-text.css';
import { PascalCaseStateName } from '../../hooks/useAlarms/transformers';

type AlarmStateTextOptions = {
  state?: PascalCaseStateName;
  inheritFontColor?: boolean;
};

export const AlarmStateText = ({
  state,
  inheritFontColor,
}: AlarmStateTextOptions) => {
  let icon = null;
  let text = null;
  let styles: React.CSSProperties = {
    gap: spaceScaledXxs,
    textDecoration: 'none',
  };

  let borderBottom = '1px dashed ';

  switch (state) {
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

  return (
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
};
