import type { SelectProps } from '@cloudscape-design/components';
import { AggregateType } from '@aws-sdk/client-iotsitewise';

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
      { label: 'Maximum Value', value: 'maxValue' },
      { label: 'Minimum Value', value: 'minValue' },
    ],
  },
};

export const LINE_RESOLUTION_OPTIONS: SelectProps.Option[] = [
  { label: '1 min', value: '1m' },
  { label: '15 min', value: '15m' },
  { label: '1 hour', value: '1h' },
  { label: '1 day', value: '1d' },
  { label: 'Raw', value: '0' },
  { label: 'Autoselect', value: undefined },
];

export const LINE_AGGREGATION_OPTIONS: SelectProps.Option[] = [
  { label: 'Average', value: AggregateType.AVERAGE },
  { label: 'Count', value: AggregateType.COUNT },
  { label: 'Maximum', value: AggregateType.MAXIMUM },
  { label: 'Minimum', value: AggregateType.MINIMUM },
  { label: 'Standard deviation', value: AggregateType.STANDARD_DEVIATION },
  { label: 'Sum', value: AggregateType.SUM },
];

export const BAR_RESOLUTION_OPTIONS: SelectProps.Option[] = [
  { label: '1 min', value: '1m' },
  { label: '15 min', value: '15m' },
  { label: '1 hour', value: '1h' },
  { label: '1 day', value: '1d' },
  { label: 'Autoselect', value: undefined },
];

export const BAR_AGGREGATION_OPTIONS: SelectProps.Option[] = [
  { label: 'Average', value: AggregateType.AVERAGE },
  { label: 'Count', value: AggregateType.COUNT },
  { label: 'Maximum', value: AggregateType.MAXIMUM },
  { label: 'Minimum', value: AggregateType.MINIMUM },
  { label: 'Standard deviation', value: AggregateType.STANDARD_DEVIATION },
  { label: 'Sum', value: AggregateType.SUM },
];
