import { type Aggregation } from '~/features/widget-customization/common/aggregation/aggregation-field';
import { type Resolution } from '@iot-app-kit/source-iotsitewise';

export const XY_PLOT_WIDGET_TYPE = 'xy-plot';
export const WIDGET_INITIAL_HEIGHT = 400;
export const WIDGET_INITIAL_WIDTH = 650;

export const DEFAULT_AGGREGATION = 'AVERAGE' satisfies Aggregation;
export const DEFAULT_RESOLUTION = '1m' satisfies Resolution;

export const dropdownConsts = {
  lineThickness: {
    defaultValue: { label: 'Normal', value: '2' },
    lineThicknessOptions: [
      { label: 'Thin', value: '1' },
      { label: 'Normal', value: '2' },
      { label: 'Thick', value: '5' },
    ],
  },
  lineType: {
    defaultValue: {
      label: 'Linear',
      value: 'linear',
      description: 'Points are joined as straight lines.',
    },
    lineTypeOptions: [
      {
        label: 'None',
        value: 'none',
        description: 'Scatter plot with no line between the points.',
      },
      {
        label: 'Linear',
        value: 'linear',
        description: 'Points are joined as straight lines.',
      },
      {
        label: 'Step before',
        value: 'step-start',
        description: 'Step points rendered at the end of the step.',
      },
      {
        label: 'Step middle',
        value: 'step-middle',
        description: 'Step points rendered in the middle of the step.',
      },
      {
        label: 'Step after',
        value: 'step-end',
        description: 'Step points rendered at the beginning of the step.',
      },
    ],
  },
  lineStyle: {
    defaultValue: { label: 'Solid', value: 'solid' },
    lineTypeOptions: [
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
    ],
  },
  dataPointStyle: {
    defaultValue: { label: 'Filled circle', value: 'filled-circle' },
    dataPointStyleOptions: [
      { label: 'Filled circle', value: 'filled-circle' },
      { label: 'Empty circle', value: 'circle' },
      { label: 'Rectangle', value: 'rectangle' },
      { label: 'Triangle', value: 'triangle' },
      { label: 'Diamond', value: 'diamond' },
      { label: 'Pin', value: 'pin' },
      { label: 'Arrow', value: 'arrow' },
    ],
  },
  legendAlignment: {
    defaultValue: { label: 'Right', value: 'right' },
    legendAlignmentOptions: [
      { label: 'Right', value: 'right' },
      { label: 'Left', value: 'left' },
      { label: 'Bottom', value: 'bottom' },
    ],
  },
  legendDisplaySection: {
    legendDisplaylist: [
      { label: 'Unit', value: 'unit' },
      { label: 'Asset name', value: 'asset' },
      { label: 'Maximum value', value: 'maxValue' },
      { label: 'Minimum value', value: 'minValue' },
      { label: 'Latest value', value: 'latestValue' },
      { label: 'Latest alarm state value', value: 'latestAlarmStateValue' },
    ],
  },
};
