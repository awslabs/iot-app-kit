import assistantIcon from '../assets/assistantIcon.svg';
import { AssistantMessage } from '../../assistant-common/AssistantMessage';
import type { IMessage } from '../../../hooks/useAssistant/types';

export interface ChatbotAssistantMessageProps {
  message: IMessage;
}

export const ChatbotAssistantMessage = ({
  message,
}: ChatbotAssistantMessageProps) => {
  return (
    <div className='message-row'>
      <img
        alt='Assistant Avatar'
        src={assistantIcon}
        width={24}
        className='assistant-icon'
      />
      <AssistantMessage message={message} />
    </div>
  );
};
