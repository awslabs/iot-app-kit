import * as React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { ChatbotCustomerMessage } from './ChatbotCustomerMessage';
import { ChatbotAssistantMessage } from './ChatbotAssistantMessage';
import { ChatbotProcessingMessage } from './ChatbotProcessingMessage';
import { ChatbotPrompts } from './ChatbotPrompts';
import {
  IMessage,
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
            if ((message.sender = SenderType.USER)) {
              return <ChatbotCustomerMessage utterance={message.content} />;
            } else {
              // const payload = message.payload as InvokeAssistantResponse;
              // const { citations = [] } = payload.response;
              return (
                <ChatbotAssistantMessage
                  text={message.content}
                  citations={[]}
                />
              );
            }
          }
        })}

        <ChatbotCustomerMessage utterance='What is the root cause of this alarm?' />

        <ChatbotProcessingMessage text='Generating a response...' />

        <ChatbotAssistantMessage
          text='Amazon S3 provides a simple web service interface that you can use to store and retrieve any amount of data, at any time, from anywhere. Using this service, you can easily build applications that make use of cloud native storage. Since Amazon S3 is highly scalable and you only pay for what you use, you can start small and grow your application as you wish, with no compromise on performance or reliability.'
          citations={[]}
        />

        <ChatbotPrompts
          prompts={[
            'What is the SOP to troubleshoot robotic arm issues?',
            'How to configure the robot arm to track conveyor movement?',
          ]}
        />
        <ChatbotCustomerMessage utterance='What is the SOP to troubleshoot robotic arm issues?' />
        <ChatbotAssistantMessage
          text='Amazon S3 provides a simple web service interface that you can use to store and retrieve any amount of data, at any time, from anywhere. Using this service, you can easily build applications that make use of cloud native storage. Since Amazon S3 is highly scalable and you only pay for what you use, you can start small and grow your application as you wish, with no compromise on performance or reliability.'
          citations={['SOP documents']}
        />
        <ChatbotCustomerMessage utterance='What is the long term impact of this issue ?' />
        <ChatbotAssistantMessage
          text='Amazon S3 provides a simple web service interface that you can use to store and retrieve any amount of data, at any time, from anywhere. Using this service, you can easily build applications that make use of cloud native storage. Since Amazon S3 is highly scalable and you only pay for what you use, you can start small and grow your application as you wish, with no compromise on performance or reliability.'
          citations={[]}
        />
      </SpaceBetween>
    </div>
  );
};
