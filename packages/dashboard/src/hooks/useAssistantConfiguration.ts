import type {
  AssistantActionEventDetail,
  AssistantProperty,
} from '@iot-app-kit/react-components';
import { useDispatch, useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { onToggleChatbotAction } from '~/store/actions/toggleChatbot';
import { useClients } from '~/components/dashboard/clientContext';
import { useMemo } from 'react';
import { IoTSiteWiseAssistantClient } from '@iot-app-kit/core-util';
import {
  onAssistantDeselectWidgetsAction,
  onAssistantSelectWidgetsAction,
} from '~/store/actions/assistantWidgetsSelection';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export const useAssistantConfiguration = (widgetId: string) => {
  const dispatch = useDispatch();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const assistant = useSelector((state: DashboardState) => state.assistant);
  const { iotSiteWise } = useClients();

  const assistantClient = useMemo(
    () =>
      new IoTSiteWiseAssistantClient({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        iotSiteWiseClient: iotSiteWise!,
      }),
    [iotSiteWise]
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
            })
          );
        } else if (event.type === 'divedeep') {
          dispatch(
            onToggleChatbotAction({
              open: true,
              callerComponentId: event.sourceComponentId,
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
              // FIXME: type of source component is string and not widget type
              widgetType: (event.sourceComponentType ??
                '') as RegisteredWidgetType,
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
