import * as React from 'react';
import type { IMessage } from '../../../hooks/useAssistant/types';
import { ChatbotAssistantMessage } from './ChatbotAssistantMessage';
import { ChatbotCustomerMessage } from './ChatbotCustomerMessage';
import { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';

export interface ChatbotTextMessageProps {
  message: IMessage;
}

export const ChatbotTextMessage = ({ message }: ChatbotTextMessageProps) => {
  if (message.sender === 'assistant') {
    return (
      <ChatbotAssistantMessage
        text={message.content}
        payload={message.payload as ResponseStream}
        key={message.id}
      />
    );
  } else {
    return (
      <ChatbotCustomerMessage utterance={message.content} key={message.id} />
    );
  }
};
