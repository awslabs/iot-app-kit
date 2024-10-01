import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '@iot-app-kit/react-components';
import { useDispatch, useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { onToggleChatbotAction } from '~/store/actions/toggleChatbot';
import { useClients } from '~/components/dashboard/clientContext';
import { useMemo } from 'react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  onAssistantDeselectWidgetsAction,
  onAssistantSelectWidgetsAction,
} from '~/store/actions/assistantWidgetsSelection';

export const useAssistant = (widgetId: string) => {
  const dispatch = useDispatch();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const assistant = useSelector((state: DashboardState) => state.assistant);
  const { iotSiteWisePrivateClient } = useClients();

  const assistantClient = useMemo(
    () =>
      new IoTSitewiseAssistantClient({
        iotSiteWiseClient: iotSiteWisePrivateClient!,
      }),
    [iotSiteWisePrivateClient]
  );

  let assistantConfiguration: AssistantProperty | undefined;
  if (readOnly && assistant.conversationId && assistant.state !== 'DISABLED') {
    assistantConfiguration = {
      client: assistantClient,
      enabled: readOnly && assistant.mode === 'on',
      conversationId: assistant.conversationId,
      componentId: widgetId,
      target: 'dashboard',
      onAction: (event: AssistantActionEventDetail) => {
        if (event.type === 'summarize') {
          dispatch(
            onToggleChatbotAction({
              open: true,
              callerComponentId: event.sourceComponentId,
              action: 'summarize',
              messages: event.messages ?? [],
            })
          );
        } else if (event.type === 'divedeep') {
          dispatch(
            onToggleChatbotAction({
              open: true,
              callerComponentId: event.sourceComponentId,
              messages: event.messages ?? [],
            })
          );
        } else if (event.type === 'selection') {
          const { selectedProperties = 1 } = event;

          dispatch(
            onAssistantDeselectWidgetsAction({
              widgetId: event.sourceComponentId,
            })
          );

          dispatch(
            onAssistantSelectWidgetsAction({
              widgetId: event.sourceComponentId,
              widgetType: event.sourceComponentType,
              selectedProperties,
            })
          );
        }
      },
    } satisfies AssistantProperty;
  }

  return {
    assistantConfiguration,
  };
};
