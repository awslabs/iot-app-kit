import { useEffect } from 'react';
import { Table, useAssistant, AssistantChatbot } from '@iot-app-kit/react-components';
import Button from '@cloudscape-design/components/button';
import { mockAlarmData } from '@iot-app-kit/testing-util';
import { DATA_TYPE } from '@iot-app-kit/core';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { type Meta, type StoryObj } from '@storybook/react';
import { MockInvokeAssistant } from '../../mockAssistantAPI';

const meta: Meta<typeof Table> = {
  title: 'Assistant/Components/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

const VIEWPORT = { duration: '30s' };

const LATEST_VALUE = 123.2;
const DATA_STREAM = {
  id: 'wind_speed',
  name: 'wind_speed',
  dataType: DATA_TYPE.NUMBER,
  data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
  resolution: 0,
  unit: 'mph',
  isLoading: false,
};

const componentId = 'a1cdf292-8a1c-4809-9c9a-3485d88c447b';
const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: MockInvokeAssistant,
  },
  defaultContext: '',
});

export const Assistant: Story = {
  render: (props) => {
    const { messages, generateSummary, clearAll } = useAssistant({
      assistantClient: client,
    });

    useEffect(() => {
      clearAll();
    }, []);

    return (
      <div style={{ height: '100px' }}>
        <Table
          viewport={VIEWPORT}
          items={[]}
          columnDefinitions={[
            {
              key: 'property',
              header: 'Property',
              sortingField: 'property',
            },
            {
              key: 'value',
              header: 'Latest value',
              sortingField: 'value',
            },
          ]}
          queries={props.queries}
          assistant={{
            client,
            enabled: true,
            componentId,
            conversationId: 'mockConversationId',
            target: 'dashboard',
            onAction:(event) => {
              if (event.type === 'selection') {
                console.log('onAction', event);
              }
            }
          }}
        />
        <br />
        <Button onClick={() => {
          clearAll();
          generateSummary({
            componentId,
            conversationId: crypto.randomUUID(),
            target: 'widget',
            utterance:
              'generate a summary and return the response in markdown format.',
          });
        }}>Generate Summary</Button>
        <br />
        {messages.length > 0 ? (
          <AssistantChatbot
            height={500}
            messages={messages}
            onSubmit={() => {}}
          />
        ): null }
      </div>
    )
  },
  args: {
    queries: [mockAlarmData()],
  },
};
