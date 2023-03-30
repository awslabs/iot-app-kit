import React from 'react';
import styled from 'styled-components';
import type { StatusIconType } from '@iot-app-kit/core';
import { STATUS_ICON_TYPE } from '@iot-app-kit/core';
import { getIcons } from '../../../common/iconUtils';

const Icon = styled.div`
  position: relative;
  margin-right: 3px;
  top: 2px;
  display: inline;
`;
export const StatusIcon: React.FC<{
  name: StatusIconType;
  color?: string; // hex color
  size?: number; // pixels
}> = ({ name = STATUS_ICON_TYPE.normal, color, size }) => (
  <Icon data-testid={`status-icon-${name}`}>{getIcons(name, color, size)}</Icon>
);
