import * as React from 'react';
import { useState, useEffect } from 'react';
import autosize from 'autosize';
import Textarea from '@cloudscape-design/components/textarea';
import Button from '@cloudscape-design/components/button';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastMessage) {
      setDisabled(lastMessage.sender === 'user' || !!lastMessage.loading);
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

    if (newValue.match(/\n/g) || newValue === '') {
      onResize();
    }
  };

  const handleKeyDown = (
    event: NonCancelableCustomEvent<InputProps.KeyDetail>
  ) => {
    if (event.detail.key === 'Enter' && !event.detail.shiftKey) {
      handleClick();
    }
    if (event.detail.key === 'Delete' || event.detail.key === 'Backspace') {
      onResize();
    }
  };

  return (
    <div className='iot-app-kit-assistant-chatbot-input'>
      <Textarea
        value={value}
        placeholder='Ask me anything about your IoT data'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
      />
      <div className='iot-app-kit-assistant-chatbot-input-button'>
        <Button
          iconName='send'
          variant='icon'
          onClick={handleClick}
          disabled={!value}
          data-testid='assistant-chatbot-input-button'
        />
      </div>
    </div>
  );
};
