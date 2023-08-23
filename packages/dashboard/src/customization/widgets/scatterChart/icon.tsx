import React from 'react';
import { default as scatterSvg } from './scatter.svg';
import { default as scatterSvgDark } from './scatter-dark.svg';

const ScatterIcon: React.FC = () => (
  <span>
    <img src={scatterSvg} alt='Scatter widget light icon' />
    <img src={scatterSvgDark} alt='Scatter widget dark icon' />
  </span>
);

export default ScatterIcon;
