import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';

export interface AssistantErrorProps {
  message: string;
}

export const AssistantError = ({ message }: AssistantErrorProps) => {
  return (
    <div className='message-row'>
      <Box variant='div' padding='s'>
        &nbsp;
      </Box>
      <Alert statusIconAriaLabel='Error' type='error'>
        {message}
      </Alert>
    </div>
  );
};
