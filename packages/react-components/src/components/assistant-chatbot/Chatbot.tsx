import * as React from 'react';
import Container from '@cloudscape-design/components/container';
import { ChatbotHeader } from './ChatbotHeader';
import { ChatbotInputBox } from './ChatbotInputBox';
import { ChatbotConversationContainer } from './conversation/ChatbotConversationContainer';
import './chatbot.css';
import { IMessage } from '../../hooks/useAssistant/types';

export interface ChatbotProps {
  messages: IMessage[];
}

export const Chatbot = ({ messages }: ChatbotProps) => {
  return (
    <div className='iot-app-kit assistant-chatbot'>
      <Container
        footer={<ChatbotInputBox />}
        header={<ChatbotHeader headerText='Sitewise Assistant' />}
        disableHeaderPaddings
        disableContentPaddings
      >
        <ChatbotConversationContainer height={400} messages={messages} />
      </Container>
    </div>
  );
};
