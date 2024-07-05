import * as React from 'react';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';

export interface ChatbotPromptsProps {
  prompts: Array<string>;
}

export const ChatbotPrompts = ({ prompts }: ChatbotPromptsProps) => {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 1, xxs: 1 } },
        { colspan: { default: 11, xxs: 11 } },
      ]}
    >
      <div />
      <SpaceBetween size='s' direction='vertical'>
        {prompts.map((prompt) => (
          <Button>{prompt}</Button>
        ))}
      </SpaceBetween>
    </Grid>
  );
};
