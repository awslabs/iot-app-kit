export const barHeightEncoding = 'BAR_HEIGHT_ENCODING';
export const barHeight = 100;

// defines 3 x-axes:
const ANOMALY_X_AXIS = {
  axisPointer: {
    link: [
      {
        xAxisIndex: 'all',
      },
    ],
  },
  xAxis: [
    // 1. x axis for large timeline, which shows a time value
    {
      name: 'anomaly-timeline-axis',
      type: 'time',
      boundaryGap: false,
      show: true,
      axisLabel: {
        hideOverlap: true,
        color: '#5f6b7a',
      },
      axisLine: {
        lineStyle: {
          color: '#e9ebed',
          width: 2,
        },
      },
      splitNumber: 6,
      gridIndex: [0, 1],
    },
    // 2. x axis for step chart
    {
      name: 'anomaly-step',
      type: 'time',
      show: true,
      axisLabel: {
        hideOverlap: true,
        color: '#5f6b7a',
      },
      axisLine: {
        lineStyle: {
          color: '#e9ebed',
          width: 2,
        },
      },
      splitNumber: 6,
      gridIndex: 1,
    },
    // 3. hides the x-axis for slider zoom timeline
    {
      name: 'anomaly-selection-axis',
      type: 'time',
      gridIndex: 2,
      boundaryGap: false,
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#e9ebed',
          width: 2,
        },
      },
    },
  ],
};

// defines 3 y-axes:
const ANOMALY_Y_AXIS = {
  yAxis: [
    // 1. y axis for timeline
    {
      type: 'value',
      show: false,
      min: 0,
      gridIndex: 0,
    },
    // 2. y axis for step chart
    {
      type: 'value',
      min: 0,
      max: 1,
      gridIndex: 1,
      axisLabel: {
        margin: 4,
        formatter: (value: number) => `${value * 100}%`,
      },
    },
    // 3. y axis for slider zoom timeline
    {
      gridIndex: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
  ],
};

// defines 3 data zooms:
const ANOMALY_DATA_ZOOM = {
  // 1. inside zoom (for gesture handling) used by timeline and step chart
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      filterMode: 'none',
      start: 0,
      end: 100,
      zoomOnMouseWheel: true,
      moveOnMouseMove: 'shift',
      moveOnMouseWheel: false,
    },
    // 2. slider zoom for main timeline
    {
      type: 'slider',
      filterMode: 'none',
      backgroundColor: 'rgba(255,255,255,0)',
      xAxisIndex: [0, 1],
      fillerColor: 'rgba(255, 110, 110, .25)',
      dataBackground: {
        lineStyle: { opacity: 0 },
        areaStyle: { opacity: 0 },
      },
      selectedDataBackground: {
        lineStyle: { color: '#ffffff', opacity: 0 },
        areaStyle: { color: '#ffffff', opacity: 0 },
      },
      textStyle: {
        backgroundColor: '#ffffff',
        borderWidth: 3,
        borderColor: '#ffffff',
      },
      moveHandleStyle: { color: '#C5C5C5' },
      handleStyle: { borderColor: '#C5C5C5' },
      height: '5%',
      bottom: '4%',
    },
    // 3. disables zoom for the slider zoom's timeline, which should always show 100% of the data
    {
      type: 'inside',
      disabled: true,
      xAxisIndex: [2],
      start: 0,
      end: 100,
    },
  ],
};

// grid layout with 3 sections:
const ANOMALY_GRID = {
  grid: [
    // 1. top section is the large timeline
    {
      left: '35px',
      right: '10px',
      height: '40%',
      top: '28px',
      show: true,
      borderColor: '#C5C5C5',
    },
    // 2. middle section is the step chart
    {
      left: '35px',
      right: '10px',
      top: '62%',
      height: '22%',
      show: true,
      borderColor: '#C5C5C5',
    },
    // 3. bottom section is a smaller slider zoom timeline
    {
      left: '37px',
      right: '12px',
      height: '5%',
      bottom: '2%',
    },
  ],
};

// defines 2 series:
export const ANOMALY_SERIES = {
  series: [
    // 1. large timeline, which a user directly interacts with
    {
      id: 'anomaly_timeline',
      type: 'bar',
      color: '#D13212',
      barMinWidth: 5,
      barMaxWidth: 10,
      xAxisIndex: 0,
      yAxisIndex: 0,
      datasetIndex: 1,
      encode: {
        x: 'timestamp',
        y: barHeightEncoding,
      },
    },
    // 2. smaller data zoom slider timeline, which always shows 100% of the data
    {
      id: 'anomaly_slider',
      type: 'bar',
      color: '#D13212',
      silent: true,
      barMinWidth: 5,
      barMaxWidth: 5,
      xAxisIndex: 2,
      yAxisIndex: 2,
      datasetIndex: 1,
      tooltip: {
        show: false,
      },
      encode: {
        x: 'timestamp',
        y: barHeightEncoding,
      },
    },
  ],
};

const ANOMALY_TITLE = {
  title: [
    {
      id: 'widget-title',
      top: '4px',
      left: '32px',
    },
    {
      id: 'contributing-properties-title',
      top: '55%',
      left: '32px',
      text: 'Contributing properties',
      textStyle: {
        fontSize: 15,
      },
    },
  ],
};

export const DEFAULT_ANOMALY_WIDGET_SETTINGS = {
  ...ANOMALY_GRID,
  ...ANOMALY_DATA_ZOOM,
  ...ANOMALY_X_AXIS,
  ...ANOMALY_Y_AXIS,
  ...ANOMALY_TITLE,
};
