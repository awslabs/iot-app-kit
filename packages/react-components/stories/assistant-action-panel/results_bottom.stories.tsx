import React from 'react';
import { Chart } from '../../src';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from '../chart/mock-data';
import { ComponentMeta } from '@storybook/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import useDataStore from '../../src/store';
import { MockInvokeAssistant } from '../assistant-chatbot/mockAPI';

const customViewports = {
  BottomSpace: {
    name: 'BottomSpace',
    styles: {
      width: '800px',
      height: '850px',
    },
  },
};

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
      defaultValue: { width: 500, height: 500 },
    },
    styleSettings: { control: { type: 'object' }, defaultValue: undefined },
    axis: { control: { type: 'object' }, defaultValue: undefined },
    thresholds: { control: { type: 'object' }, defaultValue: [] },
    legend: { control: { type: 'object' }, defaultValue: { visible: true } },
  },
  parameters: {
    viewport: {
      viewports: customViewports,
      defaultViewport: 'BottomSpace',
    },
  },
} as ComponentMeta<typeof Chart>;

export const ResultsOnTheBottom = () => {
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    defaultContext: '',
  });

  const storeState = useDataStore.getState();
  storeState.clearAssistantState();

  return (
    <div style={{ padding: '16px' }}>
      <Chart
        id='line-chart'
        defaultVisualizationType='line'
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
        assistant={{
          client,
          conversationId: crypto.randomUUID(),
          componentId: crypto.randomUUID(),
        }}
      />
    </div>
  );
};
