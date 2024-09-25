import React from 'react';
import type { PropsWithChildren } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import CloudscapePopover from '@cloudscape-design/components/popover';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { AssistantProperty } from '../../common/assistantProps';
import { VerticalSeparator } from './verticalSeparator';

export interface PopoverProps extends PropsWithChildren {
  title: string;
  content: React.ReactNode;
  footerText: string;
  assistant: AssistantProperty;
}

export const Popover = ({
  title,
  content,
  footerText,
  assistant,
  children,
}: PopoverProps) => {
  const handleSummarize = () => {};

  return (
    <CloudscapePopover
      dismissButton={true}
      header={title}
      triggerType='custom'
      size='large'
      content={
        <SpaceBetween direction='vertical' size='s'>
          {content}
          <VerticalSeparator />
          <SpaceBetween direction='horizontal' size='s' alignItems='center'>
            <Box variant='span' fontSize='body-s' padding={{ right: 's' }}>
              {footerText}
            </Box>
            {assistant ? (
              <Button
                iconName='gen-ai'
                onClick={handleSummarize}
                ariaLabel='Generate summary'
              >
                Generate summary
              </Button>
            ) : null}
          </SpaceBetween>
        </SpaceBetween>
      }
    >
      {children}
    </CloudscapePopover>
  );
};
