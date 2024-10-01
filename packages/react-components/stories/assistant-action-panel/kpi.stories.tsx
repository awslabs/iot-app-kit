import React from 'react';
import { KPI } from '../../src';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from '../kpi/kpi-mock-data';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import useDataStore from '../../src/store';
import { MockInvokeAssistant } from '../assistant-chatbot/mockAPI';

export default {
  title: 'Widgets/Assistant Action Panel',
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
} as ComponentMeta<typeof KPI>;

export const DefaultKPI: ComponentStory<typeof KPI> = ({ settings }) => {
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    defaultContext: '',
  });

  const storeState = useDataStore.getState();
  storeState.clearAssistantState();

  return (
    <>
      <div
        style={{
          height: '300px',
          width: '350px',
          padding: '80px 20px 0',
        }}
      >
        <KPI
          viewport={VIEWPORT}
          query={MOCK_TIME_SERIES_DATA_QUERY}
          settings={settings}
          assistant={{
            client,
            conversationId: 'mockId',
            componentId: crypto.randomUUID(),
            target: 'widget',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          background: 'grey',
          height: '200px',
          width: '350px',
          marginTop: '20px',
          padding: '20px',
        }}
      >
        <span
          style={{
            padding: '10px',
            marginRight: '10px',
            background: 'white',
          }}
        >
          fake component just to test assistant action panel behavior on a small
          component
        </span>
        <KPI
          viewport={VIEWPORT}
          query={MOCK_TIME_SERIES_DATA_QUERY}
          settings={settings}
          assistant={{
            client,
            conversationId: crypto.randomUUID(),
            componentId: crypto.randomUUID(),
            target: 'widget',
          }}
        />
      </div>
    </>
  );
};
