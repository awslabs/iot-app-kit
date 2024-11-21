import { type Meta, type StoryObj } from '@storybook/react';
import { Gauge } from '../../src';
import { DEFAULT_GAUGE_STYLES } from '../../src/components/gauge/constants';
import { MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY } from './mock-data';

const meta = {
  title: 'Widgets/Gauge',
  component: Gauge,
  args: {
    settings: DEFAULT_GAUGE_STYLES,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '500px', width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Gauge>;

export default meta;
type Story = StoryObj<typeof Gauge>;

export const HiddenSettingsGauge: Story = {
  args: {
    settings: {
      showName: false,
      showUnit: false,
    },
    viewport: { duration: '5m' },
    query: MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY,
  },
};
