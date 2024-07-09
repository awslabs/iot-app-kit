import * as React from 'react';
import { useState, useEffect } from 'react';
import autosize from 'autosize';
import Grid from '@cloudscape-design/components/grid';
import Textarea from '@cloudscape-design/components/textarea';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import { IMessage, SenderType } from '../../hooks/useAssistant/types';

export interface ChatbotInputBox {
  onSubmit: (utterance: string) => void;
  lastMessage?: IMessage;
}

export const ChatbotInputBox = ({ onSubmit, lastMessage }: ChatbotInputBox) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const textarea = document.querySelector(
      '.iot-app-kit-assistant-chatbot-input textarea'
    );
    if (textarea) {
      autosize(textarea);
    }
  }, []);

  useEffect(() => {
    if (lastMessage) {
      setDisabled(lastMessage.sender === SenderType.USER);
    }
  }, [lastMessage]);

  const handleClick = () => {
    if (value) {
      onSubmit(value);
      setDisabled(true);
      setValue('');
    }
  };

  return (
    <div className='iot-app-kit-assistant-chatbot-input'>
      <Grid gridDefinition={[{ colspan: 11 }, { colspan: 1 }]}>
        <Textarea
          ref={inputRef}
          value={value ?? ''}
          placeholder='Ask me anything about your IoT data'
          onChange={(event) => setValue(event.detail.value)}
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
