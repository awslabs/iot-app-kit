import { Meta, StoryObj } from '@storybook/react';
import { Chart, TimeSync, TrendCursorSync } from '@iot-app-kit/react-components';
import { mockSinWaveData } from '../../mockSinWaveData';
import React from 'react';

const meta: Meta<typeof TrendCursorSync> = {
  title: 'Components/TrendCursorSync',
  component: TrendCursorSync,
};

export default meta;

type Story = StoryObj<typeof TrendCursorSync>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '500px', width: '800px' }}>
      <TimeSync>
        <TrendCursorSync {...props}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Chart
              {...{
                ...{
                  queries: [mockSinWaveData()],
                  viewport: { duration: '10s' },
                },
                legend: {},
                size: { height: 500, width: 450 },
              }}
            />
            <Chart
              {...{
                ...{
                  queries: [mockSinWaveData()],
                  viewport: { duration: '10s' },
                },
                legend: {},
                size: { height: 500, width: 450 },
              }}
            />
          </div>
        </TrendCursorSync>
      </TimeSync>
    </div>
  ),
  args: {
    groupId: 'test',
  },
};
