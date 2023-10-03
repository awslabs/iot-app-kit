import React from 'react';
import { default as statusSvg } from './status.svg';
import { default as statusSvgDark } from './status-dark.svg';

const StatusIcon: React.FC = () => (
  <span>
    <img src={statusSvg} alt='Status widget light icon' />
    <img src={statusSvgDark} alt='Status widget dark icon' />
  </span>
);

export default StatusIcon;
