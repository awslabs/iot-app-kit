import * as React from 'react';
import { useState, useEffect } from 'react';
import autosize from 'autosize';
import Grid from '@cloudscape-design/components/grid';
import Textarea from '@cloudscape-design/components/textarea';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';

export const ChatbotInputBox = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const textarea = document.querySelector(
      '.iot-app-kit-assistant-chatbot-input textarea'
    );
    if (textarea) {
      autosize(textarea);
    }
  }, []);

  return (
    <div className='iot-app-kit-assistant-chatbot-input'>
      <Grid
        gridDefinition={[
          { colspan: { default: 11, xxs: 11 } },
          { colspan: { default: 1, xxs: 1 } },
        ]}
      >
        <Textarea
          ref={inputRef}
          value={value}
          placeholder='Ask me anything about your IoT data'
          onChange={(event) => setValue(event.detail.value)}
          rows={1}
        />
        <Box float='right'>
          <Button iconName='send' variant='icon' />
        </Box>
      </Grid>
    </div>
  );
};
