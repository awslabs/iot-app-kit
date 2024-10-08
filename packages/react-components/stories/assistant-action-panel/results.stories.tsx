import React from 'react';
import { Chart } from '../../src';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from '../chart/mock-data';
import { ComponentMeta } from '@storybook/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { MockInvokeAssistant } from '../assistant-chatbot/mockAPI';

export default {
  title: 'Widgets/Assistant Action Panel',
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
} as ComponentMeta<typeof Chart>;

export const ResultsOnTheRight = () => {
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    defaultContext: '',
  });

  return (
    <div style={{ padding: '80px 16px' }}>
      <Chart
        id='line-chart'
        defaultVisualizationType='line'
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
        assistant={{
          client,
          conversationId: crypto.randomUUID(),
          componentId: crypto.randomUUID(),
          target: 'widget',
        }}
      />
    </div>
  );
};

export const ResultsOnTheLeft = () => {
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    defaultContext: '',
  });

  return (
    <div style={{ padding: '80px 16px', width: '1400px' }}>
      <div style={{ float: 'right' }}>
        <Chart
          id='line-chart'
          defaultVisualizationType='line'
          viewport={VIEWPORT}
          queries={[MOCK_TIME_SERIES_DATA_QUERY]}
          assistant={{
            client,
            conversationId: crypto.randomUUID(),
            componentId: crypto.randomUUID(),
            target: 'widget',
          }}
        />
      </div>
    </div>
  );
};
