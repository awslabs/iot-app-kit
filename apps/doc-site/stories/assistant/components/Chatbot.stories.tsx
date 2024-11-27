/* eslint-disable */
// @ts-nocheck
import '@cloudscape-design/global-styles/index.css';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  AssistantChatbot,
  MessageType,
  useAssistant,
} from '@iot-app-kit/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { MockInvokeAssistant } from '../../mockAssistantAPI';

export default {
  title: 'Assistant/Components/Chatbot',
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

export const Standard: ComponentStory<typeof AssistantChatbot> = () => {
  const { messages, invokeAssistant, clearAll, setMessages } = useAssistant({
    assistantClient: client,
  });

  useEffect(() => {
    clearAll();
    setMessages([
      {
        content: 'Who are you ?',
        sender: 'user',
        type: MessageType.TEXT,
        id: crypto.randomUUID(),
        loading: false,
      },
      {
        content:
          'Hello, I am your AWS IoT SiteWise Assistant. Please ask me anything about your dashboard.',
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

export const LoadingState: ComponentStory<typeof AssistantChatbot> = () => {
  const messages = [
    {
      content: 'Processing assistant response, please wait..',
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

export const ErrorState: ComponentStory<typeof AssistantChatbot> = () => {
  const messages = [
    {
      content: 'Processing assistant response, please wait..',
      sender: 'assistant',
      type: MessageType.TEXT,
      id: crypto.randomUUID(),
      loading: true,
    },
    {
      content:
        'You do not have the required permissions to use the Sitewise Assistant. Please contact your administrator to request access.',
      sender: 'assistant',
      type: MessageType.ERROR,
      id: crypto.randomUUID(),
      loading: false,
      payload: {
        accessDeniedException: {
          name: 'accessDeniedException',
          message:
            'You do not have the required permissions to use the Sitewise Assistant. Please contact your administrator to request access.',
        },
      },
    },
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
