import * as React from 'react';
import { SenderType, type IMessage } from '../../../hooks/useAssistant/types';
import { ChatbotAssistantMessage } from './ChatbotAssistantMessage';
import { ChatbotCustomerMessage } from './ChatbotCustomerMessage';

export interface ChatbotTextMessageProps {
  message: IMessage;
}

export const ChatbotTextMessage = ({ message }: ChatbotTextMessageProps) => {
  if (message.sender === SenderType.ASSISTANT) {
    return (
      <ChatbotAssistantMessage
        text={message.content}
        payload={message.payload}
        key={message.id}
      />
    );
  } else {
    return (
      <ChatbotCustomerMessage utterance={message.content} key={message.id} />
    );
  }
};
