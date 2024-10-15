/* eslint-disable */
// @ts-nocheck
import React, { useEffect } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AssistantChatbot } from '../../src/components/assistant-chatbot';
import { useAssistant } from '../../src/hooks/useAssistant/useAssistant';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { MockInvokeAssistant } from './mockAPI';
import '@cloudscape-design/global-styles/index.css';
import { MessageType } from '../../src/hooks/useAssistant/types';

export default {
  title: 'Widgets/Assistant Chatbot',
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

export const AssistantChatbotDefault: ComponentStory<
  typeof AssistantChatbot
> = () => {

  const { messages, invokeAssistant, clearAll, setMessages } = useAssistant({
    assistantClient: client,
  });

  useEffect(() => {
    clearAll();
    setMessages([
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
    ]);
  }, []);

  const handleSubmit = (utterance: string) => {
    invokeAssistant({ componentId: '', conversationId, utterance });
  };

  return (
    <div style={{ padding: '0.5rem' }} data-testid='default-chatbot-story'>
      <AssistantChatbot
        height={500}
        messages={messages}
        onSubmit={handleSubmit}
        onClose={() => {}}
        header={{
          headerText: 'IoT Sitewise Assistant',
          showCloseButton: true,
          showResetButton: true,
          onReset: () => clearAll(),
          onClose: () => {},
        }}
      />
    </div>
  );
};

export const AssistantProcessingState: ComponentStory<
  typeof AssistantChatbot
> = () => {

  const messages = [
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
  ];
  
  return (
    <div style={{ padding: '0.5rem' }} data-testid='processing-chatbot-story'>
      <AssistantChatbot
        height={500}
        messages={messages}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    </div>
  );
};

export const AssistantErrorState: ComponentStory<
  typeof AssistantChatbot
> = () => {

  const messages = [
    {
      content:
        'Processing assistant response, please wait..',
      sender: 'assistant',
      type: MessageType.TEXT,
      id: crypto.randomUUID(),
      loading: true,
    },
    {
      content: 'You do not have the required permissions to use the Sitewise Assistant. Please contact your administrator to request access.',
      sender: 'assistant',
      type: MessageType.ERROR,
      id: crypto.randomUUID(),
      loading: false,
      payload: {
        accessDeniedException: {
          name: 'accessDeniedException',
          message: 'You do not have the required permissions to use the Sitewise Assistant. Please contact your administrator to request access.',
        }
      }
    }
  ];

  return (
    <div style={{ padding: '0.5rem' }} data-testid='error-chatbot-story'>
      <AssistantChatbot
        height={500}
        messages={messages}
        onSubmit={() => {}}
        onClose={() => {}}
      />
    </div>
  );
};