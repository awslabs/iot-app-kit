import * as React from 'react';
import Container from '@cloudscape-design/components/container';
import { ChatbotHeader } from './ChatbotHeader';
import { ChatbotInputBox } from './ChatbotInputBox';
import { ChatbotConversationContainer } from './conversation/ChatbotConversationContainer';
import type { IMessage } from '../../hooks/useAssistant/types';
import './chatbot.css';
import { useEffect, useState } from 'react';

export interface ChatbotProps {
  height: number;
  visible?: boolean;
  messages: IMessage[];
  onSubmit: (utterance: string) => void;
  onClose?: () => void;
}

export const Chatbot = ({
  messages,
  visible,
  height,
  onSubmit,
  onClose,
}: ChatbotProps) => {
  const [adjustedHeight, setAdjustedHeight] = useState<number>(height || 400);
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (height > 400) {
      const chatbotInput = document.querySelector(
        '.iot-app-kit-assistant-chatbot-input'
      ) as HTMLElement;
      const chatbotHeader = document.querySelector(
        '.iot-app-kit-assistant-chatbot-header'
      ) as HTMLElement;
      const chatbotInputHeight = chatbotInput?.clientHeight || 0;
      const chatbotHeaderHeight = chatbotHeader?.clientHeight || 0;
      const newHeight = height - chatbotHeaderHeight - chatbotInputHeight - 20;
      setAdjustedHeight(newHeight);
    }
  }, [visible, height]);

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
          height={adjustedHeight}
          messages={messages}
          onSubmit={onSubmit}
        />
      </Container>
    </div>
  );
};
