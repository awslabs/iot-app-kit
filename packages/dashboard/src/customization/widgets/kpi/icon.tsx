import React from 'react';

import { default as KPISvg } from './KPI.svg';
import { default as KPISvgDark } from './KPI-dark.svg';

const KPIIcon: React.FC = () => (
  <span>
    <img src={KPISvg} alt='KIP widget light icon' />
    <img src={KPISvgDark} alt='KPI widget dark icon' />
  </span>
);

export default KPIIcon;
