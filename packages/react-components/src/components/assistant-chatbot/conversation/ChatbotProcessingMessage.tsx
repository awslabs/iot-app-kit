import * as React from 'react';
import Box from '@cloudscape-design/components/box';
import LoadingBar from '@cloudscape-design/chat-components/loading-bar';

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
      <span className='assistant-processing-message-container'>
        <span className='assistant-processing-message'>
          <Box fontSize='body-s' padding='xxs'>
            {text}
          </Box>
        </span>
        <LoadingBar variant='gen-ai' />
      </span>
    </div>
  );
};
