import { useState, useEffect, useRef } from 'react';
import autosize from 'autosize';
import Textarea from '@cloudscape-design/components/textarea';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import { type IMessage } from '../../hooks/useAssistant/types';
import {
  type InputProps,
  type NonCancelableCustomEvent,
  SpaceBetween,
} from '@cloudscape-design/components';
import { FormattedMessage, useIntl } from 'react-intl';

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
  const intl = useIntl();
  const textareaRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    const textarea = document.querySelector(
      '.iot-app-kit-assistant-chatbot-input textarea'
    ) as HTMLTextAreaElement;
    if (textarea) {
      textareaRef.current = textarea;
      autosize(textareaRef.current);
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

  // as customer types and add multiple lines to textarea
  // this allows to dynamizally increase or reduce textarea height
  useEffect(() => {
    if (textareaRef.current && (value.match(/\n/g) || value === '')) {
      autosize(textareaRef.current);
      onResize();
    }
  }, [value, onResize]);

  const handleClick = () => {
    if (value) {
      onSubmit(value.trim().replace(/^\s+|\s+$/g, ''));
      setValue('');
      if (textareaRef.current) {
        // eslint-disable-next-line import/no-named-as-default-member
        autosize.destroy(textareaRef.current);
        textareaRef.current.focus();
      }
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

  const handleKeyUp = (
    event: NonCancelableCustomEvent<InputProps.KeyDetail>
  ) => {
    if (event.detail.key === 'Enter' && !event.detail.shiftKey) {
      const valueCleaned = value.trim().replace(/^\s+|\s+$/g, '');
      if (valueCleaned && !disabled) {
        handleClick();
      }
    }
    if (event.detail.key === 'Delete' || event.detail.key === 'Backspace') {
      onResize();
    }
  };

  return (
    <div className='iot-app-kit-assistant-chatbot-input'>
      <div>
        <Textarea
          value={value}
          placeholder={intl.formatMessage({
            id: 'assistant-chatbot.inputPlaceholder',
            defaultMessage: 'Ask me anything about your IoT data',
          })}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          rows={1}
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
      <SpaceBetween size='s' alignItems='center'>
        <Box
          fontSize='body-s'
          padding={{ top: 's' }}
          color='text-body-secondary'
        >
          <FormattedMessage
            id='assistant-chatbot.disclaimer'
            defaultMessage='Responses are AI-generated and for informational purposes only'
          />
        </Box>
      </SpaceBetween>
    </div>
  );
};
