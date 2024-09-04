import * as React from 'react';
import assistantIcon from '../assets/assistantIcon.svg';
import type { ResponseStream } from '@amzn/iot-black-pearl-internal-v3';
import { AssistantMessage } from '../../assistant-common/AssistantMessage';

export interface ChatbotAssistantMessageProps {
  text: string;
  payload?: ResponseStream;
}

export const ChatbotAssistantMessage = ({
  text,
  payload,
}: ChatbotAssistantMessageProps) => {
  return (
    <div className='message-row'>
      <img
        alt='Assistant Avatar'
        src={assistantIcon}
        width={24}
        className='assistant-icon'
      />
      <AssistantMessage text={text} payload={payload} />
    </div>
  );
};
