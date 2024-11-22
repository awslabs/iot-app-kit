import { type FC, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  AssistantChatbot,
  useAssistant,
  MessageType,
  useAssistantContext,
  type IMessage,
  SITUATION_SUMMARY_DEFAULT_UTTERANCE,
  EVENT_SUMMARY_DEFAULT_UTTERANCE,
} from '@iot-app-kit/react-components';
import { useClients } from '../dashboard/clientContext';
import 'animate.css';
import './assistant.css';
import { useDispatch, useSelector } from 'react-redux';
import { onCleanAssistantAction, onToggleChatbotAction } from '~/store/actions';
import { type DashboardState } from '~/store/state';
import { type DashboardMessages } from '~/messages';

export interface AssistantChatbotProps {
  height: number;
  messageOverrides: DashboardMessages;
}

export const Chatbot: FC<AssistantChatbotProps> = (
  props: AssistantChatbotProps
) => {
  const dispatch = useDispatch();
  const assistant = useSelector((state: DashboardState) => state.assistant);
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
    if (assistant.action === 'summarize') {
      if (assistant.callerComponentId === 'dashboard') {
        const contexts = assistant.selectedQueries
          .map((item) => getContextByComponent(item.widgetId))
          .join('');

        const hasAlarms = contexts.includes('alarmName');

        let totalSelected = 0;
        assistant.selectedQueries.forEach(
          (q) => (totalSelected += q.selectedProperties)
        );

        if (hasAlarms) {
          generateSummary({
            componentId: 'dashboard',
            target: 'dashboard',
            conversationId: assistant.conversationId,
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
            conversationId: assistant.conversationId,
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
    assistant.conversationId,
    assistant.callerComponentId,
    assistant.action,
    assistant.actionId,
  ]);

  const handleSubmit = (utterance: string) => {
    const contexts = assistant.selectedQueries
      .map((item) => getContextByComponent(item.widgetId))
      .join('');
    invokeAssistant({
      componentId: assistant.callerComponentId ?? 'chatbot',
      conversationId: assistant.conversationId,
      utterance,
      context: contexts,
      target: 'dashboard',
    });
  };

  const toggleChatbot = (open: boolean) => {
    dispatch(
      onToggleChatbotAction({
        open,
        callerComponentId: '',
        action: 'divedeep',
      })
    );
  };

  return (
    <AssistantChatbot
      height={props.height}
      messages={messages}
      onSubmit={handleSubmit}
      visible={!!assistant.isChatbotOpen}
      header={{
        headerText:
          props.messageOverrides.assistant.floatingMenu.buttonAIAssistant,
        showResetButton: true,
        showCloseButton: true,
        onReset: () => {
          clearAll();
          setMessages(initialMessages);
          dispatch(onCleanAssistantAction());
        },
        onClose: () => toggleChatbot(false),
      }}
    />
  );
};
