import React from 'react';

import { default as lineSvg } from './line.svg';
import { default as lineSvgDark } from './line-dark.svg';

const LineIcon: React.FC = () => (
  <span>
    <img src={lineSvg} alt='Line widget light icon' />
    <img src={lineSvgDark} alt='Line widget dark icon' />
  </span>
);

export default LineIcon;
