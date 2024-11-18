import Icon from '@cloudscape-design/components/icon';
import Box from '@cloudscape-design/components/box';

export interface ChatbotCustomerMessageProps {
  utterance: string;
}

export const ChatbotCustomerMessage = ({
  utterance,
}: ChatbotCustomerMessageProps) => {
  return (
    <div className='message-row'>
      <div className='customer-message-icon'>
        <Icon name='user-profile' variant='inverted' />
      </div>
      <Box fontSize='body-s'>
        <div className='customer-message'>{utterance}</div>
      </Box>
    </div>
  );
};
