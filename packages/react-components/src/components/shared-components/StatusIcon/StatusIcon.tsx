import React from 'react';
import './StatusIcon.css';
import { StatusIconType, STATUS_ICON_TYPE } from '@iot-app-kit/core';
import { getIcons } from '../../../common/iconUtils';

export const StatusIcon: React.FC<{
  name: StatusIconType;
  color?: string; // hex color
  size?: number; // pixels
}> = ({ name = STATUS_ICON_TYPE.NORMAL, color, size }) => (
  <div className='status-icon' data-testid={`status-icon-${name}`}>
    {getIcons(name, color, size)}
  </div>
);
