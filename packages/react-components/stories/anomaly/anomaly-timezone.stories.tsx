import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../../src/queries';
import { AnomalyChart } from '../../src/components/anomaly-chart';
import { MOCK_DATA_SOURCE_SUCCESS } from '../../src/components/anomaly-chart/tests/mockDataSources';

export default {
  title: 'Widgets/Anomaly',
  component: AnomalyChart,
  argTypes: {
    assetId: {
      control: { type: 'text' },
      defaultValue: '4a89a6b3-4a85-4ece-a598-a1ca4661d466',
    },
    axis: {
      control: { type: 'object' },
    },
    gestures: {
      control: { type: 'boolean' },
    },
    predictionDefinitionId: {
      control: { type: 'text' },
      defaultValue: 'a85b0fb2-b259-441c-aacc-d7d7495214f5',
    },
    decimalPlaces: { control: { type: 'number', defaultValue: undefined } },
    mode: {
      control: 'select',
      options: ['light', 'dark'],
      defaultValue: 'light',
    },
    tooltipSort: {
      control: 'select',
      options: ['value', 'alphabetical'],
      defaultValue: 'alphabetical',
    },
    showTimestamp: {
      control: { type: 'boolean' },
      defaultValue: true,
    },
    viewport: {
      control: { type: 'object' },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
      </>
    ),
  ],
} as ComponentMeta<typeof AnomalyChart>;

export const AnomalyChartDifferentTimeZone: ComponentStory<
  typeof AnomalyChart
> = (options) => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '350px', width: '500px', padding: '20px' }}>
        <AnomalyChart
          {...options}
          data={[MOCK_DATA_SOURCE_SUCCESS]}
          timeZone='Asia/Tokyo'
        />
      </div>
    </div>
  );
};
