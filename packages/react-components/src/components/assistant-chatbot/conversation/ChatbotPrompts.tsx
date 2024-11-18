import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';

export interface ChatbotPromptsProps {
  prompts: Array<string>;
  onClick: (utterance: string) => void;
}

export const ChatbotPrompts = ({ prompts, onClick }: ChatbotPromptsProps) => {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 1, xxs: 1 } },
        { colspan: { default: 11, xxs: 11 } },
      ]}
    >
      <div className='processing-prompts-reserved-space'>&nbsp;</div>
      <SpaceBetween size='s' direction='vertical'>
        {prompts.map((prompt) => (
          <Button
            onClick={() => onClick(prompt)}
            data-testid='assistant-chatbot-message-prompt-button'
            key={prompt}
          >
            {prompt}
          </Button>
        ))}
      </SpaceBetween>
    </Grid>
  );
};
