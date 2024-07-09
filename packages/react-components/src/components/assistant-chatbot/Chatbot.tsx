import * as React from 'react';
import { useState, useEffect } from 'react';
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
}

export const Chatbot = ({ messages, height, onSubmit }: ChatbotProps) => {
  const [ lastMessage, setLastMessage ] = useState<IMessage>();
  const lastMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    setLastMessage(messages[messages.length - 1]);
  }, [lastMessageId])

  return (
    <div className='iot-app-kit assistant-chatbot'>
      <Container
        footer={
          <ChatbotInputBox onSubmit={onSubmit} lastMessage={lastMessage} />
        }
        header={<ChatbotHeader headerText='Sitewise Assistant' />}
        disableHeaderPaddings
        disableContentPaddings
      >
        <ChatbotConversationContainer height={height} messages={messages} />
      </Container>
    </div>
  );
};
