import { type Threshold } from '@iot-app-kit/core';
import { type Meta, type StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Gauge } from '../../src';
import {
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_GAUGE_STYLES,
} from '../../src/components/gauge/constants';
import { MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY } from './mock-data';

const THRESHOLD_1 = {
  value: 30,
  id: 'abc',
  color: '#1e8103',
  comparisonOperator: 'GT',
} as const;

const THRESHOLD_2 = {
  value: 70,
  id: 'xyz',
  color: '#ed7211',
  comparisonOperator: 'GT',
} as const;

const THRESHOLD_3 = {
  value: 100,
  id: 'xyz',
  color: '#d13211',
  comparisonOperator: 'GT',
} as const;

const meta = {
  title: 'Widgets/Gauge',
  component: Gauge,
  args: {
    query: MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY,
    viewport: { duration: '5m' },
    settings: {
      gaugeThickness: DEFAULT_GAUGE_STYLES.gaugeThickness,
      color: DEFAULT_GAUGE_PROGRESS_COLOR,
      showName: DEFAULT_GAUGE_STYLES.showName,
      showUnit: DEFAULT_GAUGE_STYLES.showUnit,
      fontSize: DEFAULT_GAUGE_STYLES.fontSize,
      unitFontSize: DEFAULT_GAUGE_STYLES.unitFontSize,
      yMin: DEFAULT_GAUGE_STYLES.yMin,
      yMax: DEFAULT_GAUGE_STYLES.yMax,
    },
    thresholds: [THRESHOLD_1, THRESHOLD_2, THRESHOLD_3],
    significantDigits: 4,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof Gauge>;

export const ThresholdGauge: Story = {
  decorators: [
    (Story, { args }) => (
      <div style={{ height: '500px', width: '600px', padding: '20px' }}>
        <Story />

        <div>
          Thresholds:
          {args.thresholds?.map(({ value, comparisonOperator }) => (
            <div>
              {comparisonOperator} {value}
            </div>
          ))}
        </div>
      </div>
    ),
  ],
};

export const DeleteableThresholdsGauge: Story = {
  render: function DeleteableThresholdGauge(_story, { args }) {
    const [thresholds, setThresholds] = useState([
      THRESHOLD_1,
      THRESHOLD_2,
      THRESHOLD_3,
    ] as Threshold[]);

    return (
      <div style={{ height: '500px', width: '600px', padding: '20px' }}>
        <button onClick={() => setThresholds([])}>Remove thresholds</button>
        <Gauge {...args} thresholds={thresholds} />

        <div>
          Thresholds:
          {args.thresholds?.map(({ value, comparisonOperator }) => (
            <div>
              {comparisonOperator} {value}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
