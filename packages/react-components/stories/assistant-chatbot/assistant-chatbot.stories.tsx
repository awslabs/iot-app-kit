import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AssistantChatbot } from '../../src/components/assistant-chatbot';
import '@cloudscape-design/global-styles/index.css';

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

export const Main: ComponentStory<typeof AssistantChatbot> = () => (
  <div style={{ maxWidth: '500px' }}>
    <AssistantChatbot messages={[]}/>
  </div>
);
