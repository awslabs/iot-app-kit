import React from 'react';
import { AnomalyChart } from '@iot-app-kit/react-components';
import { Meta, StoryObj } from '@storybook/react';
import { MOCK_DATA, MOCK_DATA_ERROR, MOCK_DATA_LOADING } from './data';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof AnomalyChart> = {
  title: 'Components/AnomalyChart',
  component: AnomalyChart,
};

export default meta;

type Story = StoryObj<typeof AnomalyChart>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '400px', width: '450px' }}>
      <AnomalyChart {...{ ...props, legend: {}, size: { height: 500, width: 900 } }} />
    </div>
  ),
  args: {
    data: MOCK_DATA.data,
    viewport: { duration: '30s' },
  },
};

export const Error: Story = {
  ...Standard,
  args: {
    data: MOCK_DATA_ERROR.data,
  },
};

export const Empty: Story = {
  ...Standard,
  args: {
    data: [{state: 'success', value: {data: []}}],
  },
};

export const Loading: Story = {
  ...Standard,
  args: {
    data: MOCK_DATA_LOADING.data,
  },
};
