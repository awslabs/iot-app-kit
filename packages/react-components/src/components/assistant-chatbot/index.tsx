import React from 'react';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';
import { ChatbotProps, Chatbot } from './Chatbot';

export const AssistantChatbot = (assistantChatProps: ChatbotProps) => {
  return (
    <I18nProvider locale='en' messages={[messages]}>
      <Chatbot {...assistantChatProps} />
    </I18nProvider>
  );
}