import * as React from 'react';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';

export interface ChatbotProcessingMessageProps {
  text: string;
}

export const ChatbotProcessingMessage = ({
  text,
}: ChatbotProcessingMessageProps) => {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 1, xxs: 1 } },
        { colspan: { default: 11, xxs: 11 } },
      ]}
    >
      <div
        className='processing-message-icon'
        role='progressbar'
        aria-label={`Assistant is typing...`}
      >
        <div className='processing-message-dot' />
        <div className='processing-message-dot' />
        <div className='processing-message-dot' />
      </div>
      <Box fontSize='body-s'>
        <div className='assistant-message'>{text}</div>
      </Box>
    </Grid>
  );
};
