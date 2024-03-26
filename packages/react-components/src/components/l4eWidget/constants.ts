import { AnomalyValue } from './types';
import { formatTooltip } from './utils/formatTooltip';

// defines 2 x-axes:
// 1. x axis for main timeline, which shows timie value
// 2. hides the x-axis for the smaller timeline and hides any styling on it
const L4E_X_AXIS = {
  xAxis: [
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
      gridIndex: 0,
    },
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
  ],
};

const L4E_Y_AXIS = {
  yAxis: [
    {
      type: 'value',
      show: false,
      min: 0,
      gridIndex: 0,
    },
    {
      gridIndex: 1,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
  ],
};

const L4E_TOOLTIP = {
  tooltip: {
    show: true,
    trigger: 'item',
    confine: true,
    borderColor: '#C5C5C5',
  },
};

// defines 3 data zooms:
// 1. inside zoom for main timeline, which handles gestures
// 2. slider zoom for main timeline, which overlaps the smaller timeline
// 3. disables zoom for the smaller timeline, which will always show 100% of the data
const L4E_DATA_ZOOM = {
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100,
      zoomOnMouseWheel: true,
      moveOnMouseMove: 'shift',
      moveOnMouseWheel: false,
    },
    {
      type: 'slider',
      backgroundColor: 'rgba(255,255,255,0)',
      xAxisIndex: [0],
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
      height: 32,
      bottom: 12,
    },
    {
      type: 'inside',
      disabled: true,
      xAxisIndex: [1],
      start: 0,
      end: 100,
    },
  ],
};

// grid layout with 2 sections:
// 1. top section is the large timeline
// 2. bottom section is a smaller version of the timeline
// which is overlapped by the data zoom slider
const L4E_GRID = {
  grid: [
    {
      left: '10px',
      right: '10px',
      top: '30px',
      show: true,
      borderColor: '#C5C5C5',
    },
    {
      left: '12px',
      right: '12px',
      height: 30,
      bottom: 8,
    },
  ],
};

// defines 2 series:
// 1. large timeline, which a user directly interacts with
// 2. smaller timeline, which sits below the slider data zoom and always shows 100% of the data
const L4E_SERIES = {
  series: [
    {
      id: 'l4e_timeline',
      type: 'bar',
      color: '#D13212',
      barMinWidth: 5,
      barMaxWidth: 10,
      xAxisIndex: 0,
      yAxisIndex: 0,
      tooltip: {
        formatter: ({ data }: { data: [number, number, AnomalyValue] }) =>
          formatTooltip(data),
      },
      encode: {
        x: 'time',
        y: 'value',
      },
      selectedMode: 'multiple',
      select: {
        itemStyle: {
          color: '#015b9d',
          borderWidth: 0,
        },
      },
    },
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
        x: 'time',
        y: 'value',
      },
    },
  ],
};

export const DEFAULT_L4E_WIDGET_SETTINGS = {
  ...L4E_GRID,
  ...L4E_DATA_ZOOM,
  ...L4E_TOOLTIP,
  ...L4E_X_AXIS,
  ...L4E_Y_AXIS,
  ...L4E_SERIES,
};
