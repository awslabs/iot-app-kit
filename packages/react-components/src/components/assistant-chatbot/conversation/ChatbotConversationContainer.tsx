import * as React from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import { ChatbotTextMessage } from './ChatbotTextMessage';
import { ChatbotProcessingMessage } from './ChatbotProcessingMessage';
import { ChatbotPrompts } from './ChatbotPrompts';
import { type IMessage, MessageType } from '../../../hooks/useAssistant/types';

export interface ChatbotConversationContainerProps {
  height: number;
  messages: IMessage[];
  onSubmit: (utterance: string) => void;
}

export const ChatbotConversationContainer = ({
  height,
  messages,
  onSubmit,
}: ChatbotConversationContainerProps) => {
  const lastMessageId = messages[messages.length - 1]?.id;
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    // Only try to scroll when last message changes
    // Timeout is required to make sure component is rendered/visible
    setTimeout(() => {
      if (el?.scroll) {
        el?.scroll({ top: el?.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
    // Pass no deps because we only want to attempt to scroll on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageId, ref.current]);

  return (
    <div ref={ref} className='conversation-container' style={{ height }}>
      <Box padding={{ top: 'm' }}>
        <SpaceBetween size='s'>
          {messages.map((message) => {
            if (message.type === MessageType.TEXT) {
              if (message.loading) {
                return (
                  <ChatbotProcessingMessage
                    text={message.content}
                    key={message.id}
                  />
                );
              }
              return <ChatbotTextMessage message={message} key={message.id} />;
            }

            if (message.type === MessageType.PROMPTS) {
              const prompts =
                message.payload && Array.isArray(message.payload)
                  ? message.payload
                  : [];
              return (
                <ChatbotPrompts
                  prompts={prompts}
                  key={message.id}
                  onClick={onSubmit}
                />
              );
            }
          })}
        </SpaceBetween>
      </Box>
    </div>
  );
};
