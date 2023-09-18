import React from 'react';

import { default as textSvg } from './text.svg';
import { default as textSvgDark } from './text-dark.svg';

const TextIcon: React.FC = () => (
  <span>
    <img src={textSvg} alt='Text widget light icon' />
    <img src={textSvgDark} alt='Text widget dark icon' />
  </span>
);

export default TextIcon;
