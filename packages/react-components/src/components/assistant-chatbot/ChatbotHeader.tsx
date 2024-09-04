import * as React from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import assistantIcon from './assets/assistantIcon.svg';
import { colorBorderDividerDefault } from '@cloudscape-design/design-tokens';

export interface ChatbotHeaderProps {
  headerText: string;
  onClose?: () => void;
}

export const ChatbotHeader = ({ headerText, onClose }: ChatbotHeaderProps) => {
  return (
    <div
      className='iot-app-kit-assistant-chatbot-header'
      style={{
        borderBottom: `1px solid ${colorBorderDividerDefault}`,
      }}
    >
      <img
        alt='Assistant Avatar'
        src={assistantIcon}
        width={24}
        className='assistant-icon'
        style={{ marginLeft: '0.2rem' }}
      />
      <Box
        fontSize='body-m'
        variant='awsui-gen-ai-label'
        padding={{ left: 's' }}
      >
        {headerText}
      </Box>
      {onClose ? (
        <div className='iot-app-kit-assistant-chatbot-header-close'>
          <Button
            iconName='close'
            variant='icon'
            onClick={onClose}
            data-testid='assistant-chatbot-close-button'
          />
        </div>
      ) : null}
    </div>
  );
};
