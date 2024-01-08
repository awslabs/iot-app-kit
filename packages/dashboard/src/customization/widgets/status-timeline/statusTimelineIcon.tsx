import React from 'react';
import { default as timelineSvg } from './timeline.svg';
import { default as timelineSvgDark } from './timeline-dark.svg';
import WidgetIcon from '../components/widgetIcon';

const TimelineIcon = () => {
  return (
    <WidgetIcon
      widget='Timeline'
      defaultIcon={timelineSvg}
      darkIcon={timelineSvgDark}
    />
  );
};

export default TimelineIcon;
