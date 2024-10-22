import React, { useEffect } from 'react';
import {
  KPI,
  SITUATION_SUMMARY_DEFAULT_UTTERANCE,
  useAssistant,
} from '../../src';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from '../kpi/kpi-mock-data';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
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
  title: 'Widgets/Assistant Result Panel',
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
    viewport: {
      viewports: customViewports,
      defaultViewport: 'BottomSpace',
    },
  },
} as ComponentMeta<typeof KPI>;

const componentId = crypto.randomUUID();
export const ResultsOnTheBottom: ComponentStory<typeof KPI> = ({
  settings,
}) => {
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    defaultContext: '',
  });

  const { generateSummary } = useAssistant({
    assistantClient: client,
  });

  useEffect(() => {
    generateSummary({
      componentId,
      conversationId: crypto.randomUUID(),
      target: 'widget',
      utterance: SITUATION_SUMMARY_DEFAULT_UTTERANCE,
    });
  }, [generateSummary]);

  return (
    <div style={{ padding: '16px' }}>
      <KPI
        viewport={VIEWPORT}
        query={MOCK_TIME_SERIES_DATA_QUERY}
        settings={settings}
        assistant={{
          client,
          conversationId: 'mockId',
          componentId,
          target: 'widget',
        }}
      />
    </div>
  );
};
