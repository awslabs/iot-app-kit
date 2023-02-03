import React from 'react';
import './StatusIcon.css';
import { StatusIconType } from '../../common/constants';
import { getIcons } from '../../common/iconUtils';

export const StatusIcon: React.FC<{
  name: StatusIconType;
  color?: string; // hex color
  size?: number; // pixels
}> = ({ name = StatusIconType.NORMAL, color, size }) => (
  <div className="status-icon">{getIcons(name, color, size)}</div>
);
