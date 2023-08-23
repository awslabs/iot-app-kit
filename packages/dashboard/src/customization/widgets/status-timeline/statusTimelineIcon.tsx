import * as React from 'react';

import { default as timelineSvg } from './timeline.svg';
import { default as timelineSvgDark } from './timeline-dark.svg';

const TimelineIcon: React.FC = () => (
  <span>
    <img src={timelineSvg} alt='Timeline widget light icon' />
    <img src={timelineSvgDark} alt='Timeline widget dark icon' />
  </span>
);

export default TimelineIcon;
