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
  const { iotSiteWisePrivateClient } = useClients();
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
    iotSiteWiseClient: iotSiteWisePrivateClient!,
  });

  const {
    messages,
    setMessages,
    invokeAssistant,
    generateSummary,
    clearAll,
    startAction,
  } = useAssistant({
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

        const utterance = contexts.includes('alarmName')
          ? EVENT_SUMMARY_DEFAULT_UTTERANCE
          : SITUATION_SUMMARY_DEFAULT_UTTERANCE;
        generateSummary({
          componentId: 'dashboard',
          target: 'dashboard',
          conversationId: assistant.conversationId,
          context: contexts,
          utterance,
        });
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
    const componentContext = assistant.callerComponentId
      ? getContextByComponent(assistant.callerComponentId)
      : '';
    invokeAssistant({
      componentId: assistant.callerComponentId ?? 'chatbot',
      conversationId: assistant.conversationId,
      utterance,
      context: componentContext,
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

          assistant.selectedQueries
            .filter((item) => ['chart', 'table'].includes(item.widgetType))
            .forEach((query) => {
              startAction({
                target: 'widget',
                componentId: query.widgetId,
                action: 'clear-selection',
              });
            });
          dispatch(onCleanAssistantAction());
        },
        onClose: () => toggleChatbot(false),
      }}
    />
  );
};
