import * as React from 'react';
import { useState, useEffect } from 'react';
import autosize from 'autosize';
import Grid from '@cloudscape-design/components/grid';
import Textarea from '@cloudscape-design/components/textarea';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import { IMessage } from '../../hooks/useAssistant/types';
import {
  InputProps,
  NonCancelableCustomEvent,
} from '@cloudscape-design/components';

export interface ChatbotInputBox {
  onSubmit: (utterance: string) => void;
  onResize: () => void;
  lastMessage?: IMessage;
}

export const ChatbotInputBox = ({
  lastMessage,
  onSubmit,
  onResize,
}: ChatbotInputBox) => {
  const [value, setValue] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const textarea = document.querySelector(
      '.iot-app-kit-assistant-chatbot-input textarea'
    );
    if (textarea) {
      autosize(textarea);
      textarea.addEventListener('paste', onResize);
      return () => {
        textarea.removeEventListener('paste', onResize);
      };
    }
  }, []);

  useEffect(() => {
    if (lastMessage) {
      setDisabled(lastMessage.sender === 'user');
    }
  }, [lastMessage]);

  const handleClick = () => {
    if (value) {
      onSubmit(value);
      setDisabled(true);
      setValue('');
    }
  };

  const handleChange = (
    event: NonCancelableCustomEvent<InputProps.ChangeDetail>
  ) => {
    const { value: newValue } = event.detail;
    setValue(newValue);

    if (newValue.match(/\n/g)) {
      onResize();
    }
  };

  const handleKeyDown = (
    event: NonCancelableCustomEvent<InputProps.KeyDetail>
  ) => {
    if (event.detail.key === 'Enter' && !event.detail.shiftKey) {
      handleClick();
    }
  };

  return (
    <div className='iot-app-kit-assistant-chatbot-input'>
      <Grid gridDefinition={[{ colspan: 11 }, { colspan: 1 }]}>
        <Textarea
          value={value}
          placeholder='Ask me anything about your IoT data'
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <Box float='right'>
          <Button
            iconName='send'
            variant='icon'
            onClick={handleClick}
            disabled={!value}
            data-testid='assistant-chatbot-input-button'
          />
        </Box>
      </Grid>
    </div>
  );
};
