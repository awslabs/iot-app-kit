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

export const DefaultAssistantChatbot: ComponentStory<
  typeof AssistantChatbot
> = () => {
  const conversationId = crypto.randomUUID();
  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: {
      invokeAssistant: MockInvokeAssistant,
    },
    defaultContext: '',
  });

  const { messages, invokeAssistant } = useAssistant({
    assistantClient: client,
    initialState: {
      messages: [
        {
          content:
            'Hello, I am Sophon, an AI powered assistant for your production sites.',
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
      />
    </div>
  );
};
