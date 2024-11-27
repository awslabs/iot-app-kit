import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { Chart, useAssistant } from '@iot-app-kit/react-components';
import { mockSinWaveData } from '@iot-app-kit/testing-util';
import { type Meta, type StoryObj } from '@storybook/react';
import { MockInvokeAssistant } from '../../mockAssistantAPI';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Chart> = {
  title: 'Assistant/Components/Chart',
  component: Chart,
};

export default meta;

type Story = StoryObj<typeof Chart>;

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

    return (
      <div style={{ height: '560px', width: '900px' }}>
        Please, select an item in the table below:
        <Chart
          {...{
            ...props,
            legend: {
              visible: true,
              enabled: true,
              position: 'bottom',
              visibleContent: { maxValue: true },
              height: '110px',
            },
            size: { height: 450, width: 500 },
          }}
          id={componentId1}
          assistant={{
            client,
            enabled: true,
            componentId: componentId1,
            conversationId: 'mockConversationId',
            target: 'widget',
            onAction: (event) => {
              if (event.type === 'selection') {
                clearAll();
                generateSummary({
                  componentId: componentId1,
                  conversationId: crypto.randomUUID(),
                  target: 'widget',
                  utterance:
                    'generate a summary and return the response in markdown format.',
                });
              }
            },
          }}
        />
      </div>
    );
  },
  args: {
    queries: [mockSinWaveData()],
    viewport: { duration: '30s' },
  },
};
