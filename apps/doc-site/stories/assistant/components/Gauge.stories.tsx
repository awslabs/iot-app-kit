import { useEffect } from 'react';
// eslint-disable-next-line import/default
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { Gauge, useAssistant } from '@iot-app-kit/react-components';
import { mockSinWaveDataWithQuality } from '@iot-app-kit/testing-util';
import { type Meta, type StoryObj } from '@storybook/react';
import { MockInvokeAssistant } from '../../mockAssistantAPI';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Gauge> = {
  title: 'Assistant/Components/Gauge',
  component: Gauge,
};

export default meta;

type Story = StoryObj<typeof Gauge>;

const componentId1 = 'a1cdf292-8a1c-4809-9c9a-3485d88c447b';
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
          width: '400px',
          height: '300px',
          border: '1px solid lightgrey',
          margin: '0 auto',
        }}
      >
        <Gauge
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
    query: mockSinWaveDataWithQuality({ frequency: '5s', positiveOnly: true }),
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 16,
      unitFontSize: 16,
      yMin: -100,
      yMax: 100,
    },
  },
};
