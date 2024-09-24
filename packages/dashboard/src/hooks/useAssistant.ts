import type { AssistantActionEventDetail } from '@iot-app-kit/react-components';
import { useDispatch, useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { onToggleChatbotAction } from '~/store/actions/toggleChatbot';
import { useClients } from '~/components/dashboard/clientContext';
import { useMemo } from 'react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';

export const useAssistant = () => {
  const dispatch = useDispatch();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const assistant = useSelector((state: DashboardState) => state.assistant);
  const { iotSiteWisePrivateClient } = useClients();

  const assistantProperties = useMemo(() => {
    if (
      readOnly &&
      assistant.conversationID &&
      assistant.state !== 'DISABLED'
    ) {
      const client = new IoTSitewiseAssistantClient({
        iotSiteWiseClient: iotSiteWisePrivateClient!,
      });

      return {
        assistant: {
          client,
          enabled: readOnly,
          conversationID: assistant.conversationID,
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
        },
      };
    } else {
      return {};
    }
  }, [
    dispatch,
    assistant.conversationID,
    iotSiteWisePrivateClient,
    assistant.state,
  ]);

  return {
    assistantProperties,
  };
};
