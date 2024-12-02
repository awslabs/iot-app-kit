import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  AssistantChatbot,
  EVENT_SUMMARY_DEFAULT_UTTERANCE,
  type IMessage,
  MessageType,
  SITUATION_SUMMARY_DEFAULT_UTTERANCE,
  useAssistant,
  useAssistantContext,
} from '@iot-app-kit/react-components';
import { type FC, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useAssistantStore } from '../../features/assistant/useAssistantStore';
import { type DashboardMessages } from '../../messages';
import { useClients } from '../dashboard/clientContext';
import './assistant.css';

export interface AssistantChatbotProps {
  height: number;
  messageOverrides: DashboardMessages;
}

export const Chatbot: FC<AssistantChatbotProps> = (
  props: AssistantChatbotProps
) => {
  const toggleChatbot = useAssistantStore((store) => store.toggleChatbot)
  const cleanAssistant = useAssistantStore((store) => store.cleanAssistant)
  const conversationId = useAssistantStore((store) => store.conversationId)
  const action = useAssistantStore((store) => store.action)
  const actionId = useAssistantStore((store) => store.actionId)
  const callerComponentId = useAssistantStore((store) => store.callerComponentId)
  const isChatbotOpen = useAssistantStore((store) => store.isChatbotOpen)
  const selectedQueries = useAssistantStore((store) => store.selectedQueries)
  const { iotSiteWise } = useClients();
  const { getContextByComponent } = useAssistantContext();
  const initialMessages: Array<IMessage> = [
    {
      content: props.messageOverrides.assistant.chatbot.initialMessage,
      sender: 'assistant',
      type: MessageType.TEXT,
      id: uuid(),
      loading: false,
    },
  ];

  const client = new IoTSitewiseAssistantClient({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    iotSiteWiseClient: iotSiteWise!,
  });

  const { messages, setMessages, invokeAssistant, generateSummary, clearAll } =
    useAssistant({
      assistantClient: client,
    });

  useEffect(() => {
    if (messages.length === 0) {
      setMessages(initialMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, initialMessages]);

  useEffect(() => {
    if (action === 'summarize') {
      if (callerComponentId === 'dashboard') {
        const contexts = selectedQueries
          .map((item) => getContextByComponent(item.widgetId))
          .join('');

        const hasAlarms = contexts.includes('alarmName');

        let totalSelected = 0;
        selectedQueries.forEach(
          (q) => (totalSelected += q.selectedProperties)
        );

        if (hasAlarms) {
          generateSummary({
            componentId: 'dashboard',
            target: 'dashboard',
            conversationId,
            context: contexts,
            utterance:
              totalSelected === 1
                ? EVENT_SUMMARY_DEFAULT_UTTERANCE
                : 'generate summaries and compare and return the response in markdown format.',
          });
        } else {
          generateSummary({
            componentId: 'dashboard',
            target: 'dashboard',
            conversationId,
            context: contexts,
            utterance:
              totalSelected > 1
                ? 'generate property summaries and compare and return the response in markdown format.'
                : SITUATION_SUMMARY_DEFAULT_UTTERANCE,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    conversationId,
    callerComponentId,
    action,
    actionId,
  ]);

  const handleSubmit = (utterance: string) => {
    const contexts = selectedQueries
      .map((item) => getContextByComponent(item.widgetId))
      .join('');
    invokeAssistant({
      componentId: callerComponentId ?? 'chatbot',
      conversationId,
      utterance,
      context: contexts,
      target: 'dashboard',
    });
  };

  const handleToggleChatbot = (open: boolean) => {
    toggleChatbot({
      open,
      callerComponentId: '',
      action: 'divedeep',
    })
  };

  return (
    <AssistantChatbot
      height={props.height}
      messages={messages}
      onSubmit={handleSubmit}
      visible={!!isChatbotOpen}
      header={{
        headerText:
          props.messageOverrides.assistant.floatingMenu.buttonAIAssistant,
        showResetButton: true,
        showCloseButton: true,
        onReset: () => {
          clearAll();
          setMessages(initialMessages);
          cleanAssistant()
        },
        onClose: () => handleToggleChatbot(false),
      }}
    />
  );
};
