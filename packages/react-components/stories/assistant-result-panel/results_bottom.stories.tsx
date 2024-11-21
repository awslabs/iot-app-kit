import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { type Meta, type StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import {
  KPI,
  SITUATION_SUMMARY_DEFAULT_UTTERANCE,
  useAssistant,
} from '../../src';
import { MockInvokeAssistant } from '../assistant-chatbot/mockAPI';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from '../kpi/kpi-mock-data';

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
} as Meta<typeof KPI>;

const componentId = crypto.randomUUID();
export const ResultsOnTheBottom: StoryFn<typeof KPI> = ({ settings }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
