import * as React from 'react';
import { InvokeAssistantResponse } from '@iot-app-kit/core-util';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ChatbotCustomerMessage } from './ChatbotCustomerMessage';
import { ChatbotAssistantMessage } from './ChatbotAssistantMessage';
import { ChatbotProcessingMessage } from './ChatbotProcessingMessage';
// import { ChatbotPrompts } from './ChatbotPrompts';
import {
  type IMessage,
  MessageType,
  SenderType,
} from '../../../hooks/useAssistant/types';

export interface ChatbotConversationContainerProps {
  height: number;
  messages: IMessage[];
}

export const ChatbotConversationContainer = ({
  height,
  messages,
}: ChatbotConversationContainerProps) => {
  return (
    <div className='conversation-container' style={{ height }}>
      <br />
      <SpaceBetween size='s'>
        {messages.map((message) => {
          if (message.type === MessageType.TEXT) {
            if (message.sender === SenderType.ASSISTANT) {
              if (message.loading) {
                return (<ChatbotProcessingMessage text={message.content} />);
              }
              return (
                <ChatbotAssistantMessage
                  text={message.content}
                  payload={message.payload}
                  key={message.id}
                />
              );
            } else {
              return (<ChatbotCustomerMessage utterance={message.content} key={message.id} />);
            }
          }
        })}
      </SpaceBetween>
    </div>
  );
};
