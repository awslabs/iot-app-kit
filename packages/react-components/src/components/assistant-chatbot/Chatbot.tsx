import * as React from 'react';
import Container from '@cloudscape-design/components/container';
import { ChatbotHeader } from './ChatbotHeader';
import { ChatbotInputBox } from './ChatbotInputBox';
import { ChatbotConversationContainer } from './conversation/ChatbotConversationContainer';
import type { IMessage } from '../../hooks/useAssistant/types';
import './chatbot.css';

export interface ChatbotProps {
  height: number;
  messages: IMessage[];
}

export const Chatbot = ({ messages, height }: ChatbotProps) => {
  return (
    <div className='iot-app-kit assistant-chatbot'>
      <Container
        footer={<ChatbotInputBox />}
        header={<ChatbotHeader headerText='Sitewise Assistant' />}
        disableHeaderPaddings
        disableContentPaddings
      >
        <ChatbotConversationContainer height={height} messages={messages} />
      </Container>
    </div>
  );
};
