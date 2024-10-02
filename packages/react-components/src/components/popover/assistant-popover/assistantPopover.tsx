import React from 'react';
import type { PropsWithChildren } from 'react';
import Box from '@cloudscape-design/components/box';
import CloudscapePopover from '@cloudscape-design/components/popover';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { AssistantProperty } from '../../../common/assistantProps';
import { VerticalSeparator } from './verticalSeparator';
import { AssistantButton } from '../../assistant-button';

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
