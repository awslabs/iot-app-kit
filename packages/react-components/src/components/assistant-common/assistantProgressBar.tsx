import LoadingBar from '@cloudscape-design/chat-components/loading-bar';
import Box from '@cloudscape-design/components/box';

interface AssistantProgressBarProps {
  content: string;
}

export const AssistantProgressBar = ({
  content,
}: AssistantProgressBarProps) => {
  return (
    <div aria-live='polite'>
      <Box margin={{ bottom: 'xs', left: 'l' }} color='text-body-secondary'>
        {content}
      </Box>
      <LoadingBar variant='gen-ai' />
    </div>
  );
};
