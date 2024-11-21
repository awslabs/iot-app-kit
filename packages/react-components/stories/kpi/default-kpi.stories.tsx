import { type Meta, type StoryObj } from '@storybook/react';
import { KPI } from '../../src';
import {
  MOCK_TIME_SERIES_DATA_QUERY,
  MOCK_TIME_SERIES_DATA_QUERY_ERROR,
  MOCK_TIME_SERIES_DATA_QUERY_LOADING,
  VIEWPORT,
} from './kpi-mock-data';

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

export const DefaultKPI: Story = {
  render: (_story, { args: { settings } }) => {
    return (
      <div
        style={{
          background: 'grey',
          display: 'grid',
          width: '600px',
          gridTemplateColumns: '250px 250px',
          gridRow: 'auto auto',
          gridColumnGap: '20px',
          gridRowGap: '20px',
        }}
        data-testid='default-kpi-story'
      >
        <div style={{ height: '200px', width: '250px', padding: '20px' }}>
          <KPI
            viewport={VIEWPORT}
            query={MOCK_TIME_SERIES_DATA_QUERY}
            settings={settings}
            titleText='KPI Title (Unit)'
          />
        </div>
        <div style={{ height: '200px', width: '250px', padding: '20px' }}>
          <KPI
            viewport={VIEWPORT}
            query={MOCK_TIME_SERIES_DATA_QUERY_LOADING}
          />
        </div>
        <div style={{ height: '200px', width: '250px', padding: '20px' }}>
          <KPI viewport={VIEWPORT} query={MOCK_TIME_SERIES_DATA_QUERY_ERROR} />
        </div>
        <div style={{ height: '200px', width: '250px', padding: '20px' }}>
          <KPI
            viewport={VIEWPORT}
            query={MOCK_TIME_SERIES_DATA_QUERY}
            thresholds={[
              {
                value: 20,
                id: 'abc',
                color: '#be1c1f',
                fill: '#be1c1f',
                comparisonOperator: 'GT',
              },
            ]}
          />
        </div>
      </div>
    );
  },
};
