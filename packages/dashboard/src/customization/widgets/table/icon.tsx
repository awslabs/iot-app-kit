import React from 'react';

import { default as tableSvg } from './table.svg';
import { default as tableSvgDark } from './table-dark.svg';

const TableIcon: React.FC = () => (
  <span>
    <img src={tableSvg} alt='Table widget light icon' />
    <img src={tableSvgDark} alt='Table widget dark icon' />
  </span>
);

export default TableIcon;
