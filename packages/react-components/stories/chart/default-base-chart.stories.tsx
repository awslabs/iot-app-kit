import { type Meta } from '@storybook/react';
import { Chart } from '../../src';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from './mock-data';

export default {
  title: 'Widgets/Base Chart',
  component: Chart,
  argTypes: {
    showAllVisualizationTypes: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    id: { control: { type: 'text' }, defaultValue: undefined },
    significantDigits: { control: { type: 'number', defaultValue: undefined } },
    size: {
      control: { type: 'object' },
      defaultValue: { width: 800, height: 500 },
    },
    styleSettings: { control: { type: 'object' }, defaultValue: undefined },
    axis: { control: { type: 'object' }, defaultValue: undefined },
    thresholds: { control: { type: 'object' }, defaultValue: [] },
    legend: { control: { type: 'object' }, defaultValue: { visible: true } },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Chart>;

export const DefaultBaseChart = () => {
  return (
    <div style={{ padding: '16px' }}>
      <Chart
        id='default-line-chart'
        defaultVisualizationType='line'
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
        titleText='Data streams'
      />
    </div>
  );
};
