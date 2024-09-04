/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AssistantChatbot } from '../../src/components/assistant-chatbot';
import { useAssistant } from '../../src/hooks/useAssistant/useAssistant';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { MockInvokeAssistant } from './mockAPI';
import '@cloudscape-design/global-styles/index.css';
import { MessageType } from '../../src/hooks/useAssistant/types';

export default {
  title: 'Widgets/AssistantChatbot',
  component: AssistantChatbot,
  argTypes: {
    accessKeyId: { control: { type: 'string' } },
    secretAccessKey: { control: { type: 'string' } },
    sessionToken: { control: { type: 'string' } },
    containerWidth: { control: { type: 'number' }, defaultValue: 200 },
    containerHeight: { control: { type: 'number' }, defaultValue: 200 },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof AssistantChatbot>;

const conversationId = crypto.randomUUID();
const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: MockInvokeAssistant,
  },
  defaultContext: '',
});

export const ConnectedAssistantChatbot: ComponentStory<
  typeof AssistantChatbot
> = () => {

  const { messages, invokeAssistant } = useAssistant({
    assistantClient: client,
    initialState: {
      messages: [
        {
          content:
            'Who are you ?',
          sender: 'user',
          type: MessageType.TEXT,
          id: crypto.randomUUID(),
          loading: false,
        },
        {
          content:
            'Hello, I am an AI powered assistant for your production floor, please ask me anything.',
          sender: 'assistant',
          type: MessageType.TEXT,
          id: crypto.randomUUID(),
          loading: false,
        },
      ],
    },
  });

  const handleSubmit = (utterance: string) => {
    invokeAssistant(conversationId, utterance);
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      <AssistantChatbot
        height={500}
        messages={messages}
        onSubmit={handleSubmit}
        onClose={() => {}}
      />
    </div>
  );
};

export const ProcessingAssistant: ComponentStory<
  typeof AssistantChatbot
> = () => {

  const { messages } = useAssistant({
    assistantClient: client,
    initialState: {
      messages: [
        {
          content:
            'Processing assistant response, please wait..',
          sender: 'assistant',
          type: MessageType.TEXT,
          id: crypto.randomUUID(),
          loading: true,
        },
        {
          content:
            'Processing assistant response, please wait...processing assistant response, please wait...processing assistant response, please wait...',
          sender: 'assistant',
          type: MessageType.TEXT,
          id: crypto.randomUUID(),
          loading: true,
        },
      ],
    },
  });
  
  return (
    <div style={{ padding: '0.5rem' }}>
      <AssistantChatbot
        height={500}
        messages={messages}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    </div>
  );
};
