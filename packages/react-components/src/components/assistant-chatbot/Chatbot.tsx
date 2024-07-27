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
  onSubmit: (utterance: string) => void;
  onClose?: () => void;
}

export const Chatbot = ({
  messages,
  height,
  onSubmit,
  onClose,
}: ChatbotProps) => {
  const lastMessage = messages[messages.length - 1];

  return (
    <div className='iot-app-kit assistant-chatbot'>
      <Container
        footer={
          <ChatbotInputBox onSubmit={onSubmit} lastMessage={lastMessage} />
        }
        header={
          <ChatbotHeader headerText='Sitewise Assistant' onClose={onClose} />
        }
        disableHeaderPaddings
        disableContentPaddings
      >
        <ChatbotConversationContainer
          height={height}
          messages={messages}
          onSubmit={onSubmit}
        />
      </Container>
    </div>
  );
};
