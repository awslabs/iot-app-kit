import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import { type IconProps, SpaceBetween } from '@cloudscape-design/components';
import { useIntl } from 'react-intl';
import Badge from '@cloudscape-design/components/badge';

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
      <SpaceBetween direction='horizontal' size='xs'>
        <Box fontSize='heading-s' fontWeight='bold'>
          {props.headerText}
        </Box>
        <Badge>Preview</Badge>
      </SpaceBetween>
      <div className='iot-app-kit-assistant-chatbot-header-buttons'>
        <SpaceBetween direction='horizontal' size='xs'>
          {props.showResetButton && props.onReset ? (
            <Button
              iconName='add-plus'
              variant='link'
              onClick={props.onReset}
              ariaLabel={intl.formatMessage({
                id: 'assistant-chatbot.newChat',
                defaultMessage: 'New chat',
              })}
              data-testid='assistant-chatbot-reset-button'
            >
              {intl.formatMessage({
                id: 'assistant-chatbot.newChat',
                defaultMessage: 'New chat',
              })}
            </Button>
          ) : null}
          {props.showCloseButton && props.onClose ? (
            <Button
              iconName={props.closeIconName ?? 'close'}
              variant='icon'
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
