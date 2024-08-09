import React from 'react';
import { KPI } from '../../src';
import { ComponentMeta } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from './kpi-mock-data';

export default {
  title: 'Widgets/KPI',
  component: KPI,
  argTypes: {
    color: { control: { type: 'color' } },
    significantDigits: { control: { type: 'number' } },
  },
  controls: { disable: true },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KPI>;

export const KPIHiddenSettings = () => {
  return (
    <div style={{ background: 'grey' }} data-testid='hidden-values-kpi-story'>
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          viewport={VIEWPORT}
          query={MOCK_TIME_SERIES_DATA_QUERY}
          settings={{
            showName: false,
            showTimestamp: false,
            showUnit: false,
            showAggregationAndResolution: false,
          }}
        />
      </div>
    </div>
  );
};
