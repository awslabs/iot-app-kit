import * as React from 'react';
import Grid from '@cloudscape-design/components/grid';
import Icon from '@cloudscape-design/components/icon';
import Box from '@cloudscape-design/components/box';

export interface ChatbotCustomerMessageProps {
  utterance: string;
}

export const ChatbotCustomerMessage = ({
  utterance,
}: ChatbotCustomerMessageProps) => {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 1, xxs: 1 } },
        { colspan: { default: 11, xxs: 11 } },
      ]}
    >
      <div className='customer-message-icon'>
        <Icon name='user-profile' variant='inverted' />
      </div>
      <Box fontSize='body-s'>
        <div className='customer-message'>{utterance}</div>
      </Box>
    </Grid>
  );
};
