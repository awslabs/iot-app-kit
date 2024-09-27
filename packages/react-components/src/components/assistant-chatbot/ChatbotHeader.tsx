import * as React from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { SpaceBetween } from '@cloudscape-design/components';

export interface ChatbotHeaderProps {
  headerText: string;
  showResetButton?: boolean;
  showCloseButton?: boolean;
  onReset?: () => void;
  onClose?: () => void;
}

export const ChatbotHeader = (props: ChatbotHeaderProps) => {
  return (
    <div className='iot-app-kit-assistant-chatbot-header'>
      <Box fontSize='heading-s' fontWeight='bold'>
        {props.headerText}
      </Box>
      <div className='iot-app-kit-assistant-chatbot-header-buttons'>
        <SpaceBetween direction='horizontal' size='s'>
          {props.showResetButton && props.onReset ? (
            <Button
              iconName='refresh'
              variant='normal'
              ariaLabel='Reset'
              onClick={props.onReset}
              data-testid='assistant-chatbot-reset-button'
            />
          ) : null}
          {props.showCloseButton && props.onClose ? (
            <Button
              iconName='close'
              variant='normal'
              onClick={props.onClose}
              ariaLabel='Close'
              data-testid='assistant-chatbot-close-button'
            />
          ) : null}
        </SpaceBetween>
      </div>
    </div>
  );
};
