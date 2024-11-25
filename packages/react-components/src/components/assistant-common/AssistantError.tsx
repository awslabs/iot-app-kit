import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import { useIntl } from 'react-intl';

export interface AssistantErrorProps {
  message: string;
}

export const AssistantError = ({ message }: AssistantErrorProps) => {
  const intl = useIntl();
  return (
    <div className='message-row'>
      <Box variant='div' padding='s'>
        &nbsp;
      </Box>
      <Alert
        header={intl.formatMessage({
          id: 'assistant-chatbot.error.header',
          defaultMessage: 'Assitant failure',
        })}
        statusIconAriaLabel='Error'
        type='error'
      >
        {intl.formatMessage({
          id: 'assistant-chatbot.error.header',
          defaultMessage:
            'An unexpected error occurred when the assistant was processing. Please try again in few seconds.',
        })}
        {message}
      </Alert>
    </div>
  );
};
