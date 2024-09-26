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
      enabled: readOnly,
      conversationId: assistant.conversationId,
      componentId: widgetId,
      iconPosition: 'topLeft',
      onAction: (event: AssistantActionEventDetail) => {
        if (event.type === 'divedeep') {
          dispatch(
            onToggleChatbotAction({
              open: true,
              componentId: event.sourceComponentId,
              messages: event.messages ?? [],
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
