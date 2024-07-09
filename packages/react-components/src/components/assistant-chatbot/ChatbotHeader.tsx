import * as React from 'react';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import assistantIcon from './assets/assistantIcon.svg';

export interface ChatbotHeaderProps {
  headerText: string;
  onClose?: () => void;
}

export const ChatbotHeader = ({ headerText, onClose }: ChatbotHeaderProps) => {
  return (
    <>
      <Box padding={{ top: 'xxs', left: 'm', right: 'm' }}>
        <Grid
          gridDefinition={[
            { colspan: { default: 1, xxs: 1 } },
            { colspan: { default: 10, xxs: 10 } },
            { colspan: { default: 1, xxs: 1 } },
          ]}
          disableGutters
        >
          <img
            alt='Assistant Avatar'
            src={assistantIcon}
            width={24}
            className='assistant-icon'
            style={{ marginLeft: '0.2rem' }}
          />
          <Box
            fontSize='body-s'
            variant='awsui-gen-ai-label'
            padding={{ top: 'xs', bottom: 's', left: 'xs' }}
          >
            {headerText}
          </Box>
          <Box float='right'>
            <Button iconName='close' variant='icon' onClick={onClose} />
          </Box>
        </Grid>
      </Box>
      <hr style={{ margin: 0 }} />
    </>
  );
};
