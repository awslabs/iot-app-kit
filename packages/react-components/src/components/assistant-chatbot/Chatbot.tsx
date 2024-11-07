import Container from '@cloudscape-design/components/container';
import { ChatbotHeader, type ChatbotHeaderProps } from './ChatbotHeader';
import { ChatbotInputBox } from './ChatbotInputBox';
import { ChatbotConversationContainer } from './conversation/ChatbotConversationContainer';
import type { IMessage } from '../../hooks/useAssistant/types';
import './chatbot.css';
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

export interface ChatbotProps {
  height: number;
  visible?: boolean;
  messages: IMessage[];
  onSubmit: (utterance: string) => void;
  header?: ChatbotHeaderProps;
}

const MIN_HEIGHT = 400;

const adjustHeight = (height: number) => {
  const chatbotInput = document.querySelector(
    '.iot-app-kit-assistant-chatbot-input'
  ) as HTMLElement;
  const chatbotHeader = document.querySelector(
    '.iot-app-kit-assistant-chatbot-header'
  ) as HTMLElement;
  const chatbotInputHeight = chatbotInput?.clientHeight || 0;
  const chatbotHeaderHeight = chatbotHeader?.clientHeight || 0;
  const newHeight = height - chatbotHeaderHeight - chatbotInputHeight - 50;
  return newHeight;
};

export const Chatbot = ({
  messages,
  visible,
  height = MIN_HEIGHT,
  onSubmit,
  header,
}: ChatbotProps) => {
  const [adjustedHeight, setAdjustedHeight] = useState<number>(height);
  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (height > MIN_HEIGHT) {
      setAdjustedHeight(adjustHeight(height));
    }
  }, [visible, height]);

  return (
    <IntlProvider locale='en' defaultLocale='en'>
      <div className='iot-app-kit assistant-chatbot'>
        <Container
          footer={
            <ChatbotInputBox
              onSubmit={onSubmit}
              onResize={() => setAdjustedHeight(adjustHeight(height))}
              lastMessage={lastMessage}
            />
          }
          header={header ? <ChatbotHeader {...header} /> : null}
          disableHeaderPaddings
          disableContentPaddings
        >
          <ChatbotConversationContainer
            height={adjustedHeight}
            messages={messages}
            onSubmit={onSubmit}
          />
        </Container>
      </div>
    </IntlProvider>
  );
};
