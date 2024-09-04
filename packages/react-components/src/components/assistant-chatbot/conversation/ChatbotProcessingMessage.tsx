import * as React from 'react';
import Box from '@cloudscape-design/components/box';

export interface ChatbotProcessingMessageProps {
  text: string;
}

export const ChatbotProcessingMessage = ({
  text,
}: ChatbotProcessingMessageProps) => {
  return (
    <div className='message-row'>
      <div
        className='processing-message-icon'
        role='progressbar'
        aria-label='Assistant is typing...'
      >
        <div className='processing-message-dot' />
        <div className='processing-message-dot' />
        <div className='processing-message-dot' />
      </div>
      <span className='assistant-message'>
        <Box fontSize='body-s' padding='xxs'>
          {text}
        </Box>
      </span>
    </div>
  );
};
