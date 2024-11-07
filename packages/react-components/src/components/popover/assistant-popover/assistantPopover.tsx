import Box from '@cloudscape-design/components/box';
import CloudscapePopover from '@cloudscape-design/components/popover';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { PropsWithChildren } from 'react';
import type { AssistantProperty } from '../../../common/assistantProps';
import { AssistantButton } from '../../assistant-button';
import { VerticalSeparator } from './verticalSeparator';

export interface AssistantPopoverProps extends PropsWithChildren {
  assistant: AssistantProperty;
  title?: string;
  content?: React.ReactNode;
  footerText?: string;
  handleSummarize?: () => void;
}

export const AssistantPopover = ({
  title,
  content,
  footerText,
  assistant,
  handleSummarize,
  children,
}: AssistantPopoverProps) => {
  return (
    <CloudscapePopover
      dismissButton={true}
      header={title}
      triggerType='custom'
      size='large'
      fixedWidth={true}
      renderWithPortal={true}
      content={
        <SpaceBetween direction='vertical' size='s'>
          {content}
          <VerticalSeparator />
          <SpaceBetween direction='horizontal' size='s' alignItems='center'>
            <Box variant='span' fontSize='body-s' padding={{ right: 's' }}>
              {footerText}
            </Box>
            {assistant ? (
              <AssistantButton
                label='Generate summary'
                onClick={handleSummarize}
              />
            ) : null}
          </SpaceBetween>
        </SpaceBetween>
      }
    >
      {children}
    </CloudscapePopover>
  );
};
