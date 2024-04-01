// defines 3 x-axes:
const L4E_X_AXIS = {
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
      name: 'l4e-timeline-axis',
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
      gridIndex: [0, 2],
    },
    // 2. hides the x-axis for slider zoom timeline
    {
      name: 'l4e-selection-axis',
      type: 'time',
      gridIndex: 1,
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
    // 3. x axis for step chart
    {
      name: 'l4e-step',
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
      gridIndex: 2,
    },
  ],
};

// defines 3 y-axes:
const L4E_Y_AXIS = {
  yAxis: [
    // 1. y axis for timeline
    {
      type: 'value',
      show: false,
      min: 0,
      gridIndex: 0,
    },
    // 2. y axis for slider zoom timeline
    {
      gridIndex: 1,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    // 3. y axis for step chart
    {
      type: 'value',
      show: false,
      min: 0,
      gridIndex: 2,
    },
  ],
};

// defines 3 data zooms:
const L4E_DATA_ZOOM = {
  // 1. inside zoom (for gesture handling) used by timeline and step chart
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 2],
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
      xAxisIndex: [0, 2],
      fillerColor: 'rgba(255, 110, 110, .25)',
      dataBackground: {
        lineStyle: { opacity: 0 },
        areaStyle: { opacity: 0 },
      },
      selectedDataBackground: {
        lineStyle: { color: '#ffffff', opacity: 0 },
        areaStyle: { color: '#ffffff', opacity: 0 },
      },
      moveHandleStyle: { color: '#C5C5C5' },
      handleStyle: { borderColor: '#C5C5C5' },
      height: 30,
      top: '30%',
    },
    // 3. disables zoom for the slider zoom's timeline, which should always show 100% of the data
    {
      type: 'inside',
      disabled: true,
      xAxisIndex: [1],
      start: 0,
      end: 100,
    },
  ],
};

// grid layout with 3 sections:
const L4E_GRID = {
  grid: [
    // 1. top section is the large timeline
    {
      left: '10px',
      right: '10px',
      height: '20%',
      top: '5%',
      show: true,
      borderColor: '#C5C5C5',
    },
    // 2. middle section is a smaller slider zoom timeline
    {
      left: '12px',
      right: '12px',
      height: '5%',
      top: '31%',
    },
    // 3. bottom section is the step chart
    {
      left: '12px',
      right: '12px',
      bottom: '5%',
      height: '50%',
      show: true,
      borderColor: '#C5C5C5',
    },
  ],
};

// defines 2 series:
export const L4E_SERIES = {
  series: [
    // 1. large timeline, which a user directly interacts with
    {
      id: 'l4e_timeline',
      type: 'bar',
      color: '#D13212',
      barMinWidth: 5,
      barMaxWidth: 10,
      xAxisIndex: 0,
      yAxisIndex: 0,
      encode: {
        dataSetIndex: 0,
        x: 'time',
        y: 'value',
      },
      selectedMode: 'single',
      select: {
        itemStyle: {
          color: '#015b9d',
          borderWidth: 0,
        },
      },
    },
    // 2. smaller data zoom slider timeline, which always shows 100% of the data
    {
      id: 'l4e_slider',
      type: 'bar',
      color: '#D13212',
      silent: true,
      barMinWidth: 5,
      barMaxWidth: 5,
      xAxisIndex: 1,
      yAxisIndex: 1,
      tooltip: {
        show: false,
      },
      encode: {
        datasetIndex: 0,
        x: 'time',
        y: 'value',
      },
    },
  ],
};

const L4E_TITLE = {
  title: [
    {
      id: 'widget-title',
      top: '5px',
      left: '5px',
    },
    {
      id: 'contributing-properties-title',
      bottom: '55%',
      left: '5px',
      text: 'Contributing properties',
    },
  ],
};

export const DEFAULT_L4E_WIDGET_SETTINGS = {
  ...L4E_GRID,
  ...L4E_DATA_ZOOM,
  ...L4E_X_AXIS,
  ...L4E_Y_AXIS,
  ...L4E_TITLE,
};
