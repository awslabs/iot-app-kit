export const DEFAULT_GAUGE_PROGRESS_COLOR = '#0173BC';

export const DEFAULT_GAUGE_STYLES = {
  gaugeThickness: 30,
  showName: false,
  showUnit: true,
  fontSize: 40,
  labelFontSize: 12,
  unitFontSize: 16,
  yMin: 0,
  yMax: 100,
};

export const DEFAULT_EMPTY_SERIES = {
  id: 'empty-gauge-series',
  type: 'gauge',
  center: ['50%', '70%'], //The first value '50%' is used to horizontally center the component, while the second value '70%' is used to vertically position the component starting from the top.
  radius: '98%', //radius of the gauge
  startAngle: 190, //start angle of the gauge in degrees
  endAngle: -10, //end angle of the gauge in degrees
  silent: true, //control mouse hover actions
  detail: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  pointer: {
    show: false,
  },
  splitLine: {
    show: false,
  },
  axisLabel: {
    show: false,
  },
  title: {
    show: false,
  },
};
export const DEFAULT_PROGRESS_SERIES = {
  id: 'progress-gauge-series',
  type: 'gauge',
  center: ['50%', '70%'], //The first value '50%' is used to horizontally center the component, while the second value '70%' is used to vertically position the component starting from the top.
  radius: '98%', //radius of the gauge progress bar
  startAngle: 190, //start angle of the gauge in degrees progress bar
  endAngle: -10, //end angle of the gauge in degrees progress bar
  silent: true, //control mouse hover actions
  animation: false, // no animation while value changes
  pointer: {
    show: false,
  },
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  splitLine: {
    show: false,
  },
  axisLabel: {
    show: false,
  },
};

export const DEFAULT_THRESHOLD_SERIES = {
  id: 'threshold-gauge-series',
  type: 'gauge',
  center: ['50%', '70%'], //The first value '50%' is used to horizontally center the component, while the second value '70%' is used to vertically position the component starting from the top.
  radius: '100%', //radius of the gauge outside the arc
  startAngle: 190, //start angle of the gauge in degrees
  endAngle: -10, //end angle of the gauge in degrees
  silent: true, //control mouse hover actions
  splitNumber: 10, //number of split lines in the outside the arc
  progress: {
    show: false,
  },
  pointer: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  splitLine: {
    /**
     * make split line distance to oustside arc, length, wider, and default color in white
     */
    distance: 0,
    length: 3,
    lineStyle: {
      width: 1,
      color: '#fff',
    },
  },
  axisLabel: {
    /**
     * make axis label distance to oustside arc, color, rotate and font size
     */
    distance: -20,
    color: 'auto',
    fontSize: 12,
    rotate: 'tangential', // Given tangential because if min and max are having four or more digit number and if the rotate is not tangential then the label is overlapping with the arc
  },
  anchor: {
    show: false,
  },
  title: {
    show: false, //hide title for outside arc
  },
};
