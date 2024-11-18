import type { IMessage } from '../../../hooks/useAssistant/types';
import { ChatbotAssistantMessage } from './ChatbotAssistantMessage';
import { ChatbotCustomerMessage } from './ChatbotCustomerMessage';

export interface ChatbotTextMessageProps {
  message: IMessage;
}

export const ChatbotTextMessage = ({ message }: ChatbotTextMessageProps) => {
  if (message.sender === 'assistant') {
    return <ChatbotAssistantMessage message={message} key={message.id} />;
  } else {
    return (
      <ChatbotCustomerMessage utterance={message.content} key={message.id} />
    );
  }
};
