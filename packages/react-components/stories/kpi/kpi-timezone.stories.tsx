import { type Meta, type StoryObj } from '@storybook/react';
import { KPI } from '../../src';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from './kpi-mock-data';

export default {
  title: 'Widgets/KPI',
  component: KPI,
  argTypes: {
    settings: {
      color: { control: { type: 'color' } },
      significantDigits: { control: { type: 'number' } },
      showName: { control: { type: 'boolean' } },
      showTimestamp: { control: { type: 'boolean' } },
      showUnit: { control: { type: 'boolean' } },
      showAggregationAndResolution: { control: { type: 'boolean' } },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof KPI>;

type Story = StoryObj<typeof KPI>;

export const KPIWithTimeZoneProp: Story = {
  render: (_story, { args: { settings } }) => {
    return (
      <div style={{ background: 'grey' }}>
        <div style={{ height: '200px', width: '250px', padding: '20px' }}>
          <KPI
            viewport={VIEWPORT}
            query={MOCK_TIME_SERIES_DATA_QUERY}
            settings={settings}
            timeZone='Asia/Tokyo'
          />
        </div>
      </div>
    );
  },
};
