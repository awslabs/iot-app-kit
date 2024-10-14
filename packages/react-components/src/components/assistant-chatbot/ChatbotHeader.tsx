import * as React from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { IconProps, SpaceBetween } from '@cloudscape-design/components';
import { useIntl } from 'react-intl';

export interface ChatbotHeaderProps {
  headerText: string;
  closeIconName?: IconProps.Name;
  showResetButton?: boolean;
  showCloseButton?: boolean;
  onReset?: () => void;
  onClose?: () => void;
}

export const ChatbotHeader = (props: ChatbotHeaderProps) => {
  const intl = useIntl();

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
              onClick={props.onReset}
              ariaLabel={intl.formatMessage({
                id: 'assistant-chatbot.reset',
                defaultMessage: 'Reset',
              })}
              data-testid='assistant-chatbot-reset-button'
            />
          ) : null}
          {props.showCloseButton && props.onClose ? (
            <Button
              iconName={props.closeIconName ?? 'close'}
              variant='normal'
              onClick={props.onClose}
              ariaLabel={intl.formatMessage({
                id: 'assistant-chatbot.close',
                defaultMessage: 'Close',
              })}
              data-testid='assistant-chatbot-close-button'
            />
          ) : null}
        </SpaceBetween>
      </div>
    </div>
  );
};
