import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { KPI, useAssistant } from '@iot-app-kit/react-components';
import { mockAlarmData, mockSinWaveData } from '@iot-app-kit/testing-util';
import { type Meta, type StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { MockInvokeAssistant } from '../../mockAssistantAPI';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof KPI> = {
  title: 'Assistant/Components/KPI',
  component: KPI,
};

export default meta;

type Story = StoryObj<typeof KPI>;

const componentId1 = 'a1cdf292-8a1c-4809-9c9a-3485d88c447b';
const componentId2 = 'a2cdf292-8a1c-4809-9c9a-3485d88c447b';
const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: MockInvokeAssistant,
  },
  defaultContext: '',
});

export const Assistant: Story = {
  render: (props) => {
    const { generateSummary, clearAll } = useAssistant({
      assistantClient: client,
    });

    useEffect(() => {
      clearAll();
      generateSummary({
        componentId: componentId1,
        conversationId: crypto.randomUUID(),
        target: 'widget',
        utterance:
          'generate a summary and return the response in markdown format.',
      });
    }, []);

    return (
      <div
        style={{
          width: '300px',
          height: '200px',
          border: '1px solid lightgrey',
        }}
      >
        <KPI
          {...props}
          assistant={{
            client,
            enabled: true,
            componentId: componentId1,
            conversationId: 'mockConversationId',
            target: 'widget',
          }}
        />
      </div>
    );
  },
  args: {
    query: mockSinWaveData('5s'),
    settings: {
      showUnit: true,
      showName: true,
      showTimestamp: true,
      showAggregationAndResolution: true,
      fontSize: 30,
      secondaryFontSize: 12,
      backgroundColor: '#ffffff',
    },
  },
};

export const Alarm: Story = {
  render: (props) => {
    const { generateSummary, getContextByComponent } = useAssistant({
      assistantClient: client,
    });

    return (
      <div
        style={{
          width: '300px',
          height: '200px',
          border: '1px solid lightgrey',
        }}
      >
        <KPI
          {...props}
          assistant={{
            client,
            enabled: true,
            componentId: componentId2,
            conversationId: 'mockConversationId',
            target: 'widget',
            onAction: (event) => {
              if (event.type === 'summarize') {
                generateSummary({
                  componentId: event.sourceComponentId,
                  conversationId: crypto.randomUUID(),
                  target: 'widget',
                  utterance:
                    'generate a summary and return the response in markdown format.',
                  context: getContextByComponent(event.sourceComponentId),
                });
              }
            },
          }}
        />
      </div>
    );
  },
  args: {
    query: mockAlarmData(),
    settings: {
      showUnit: true,
      showName: true,
      showTimestamp: true,
      showAggregationAndResolution: true,
      fontSize: 30,
      secondaryFontSize: 12,
    },
  },
};
