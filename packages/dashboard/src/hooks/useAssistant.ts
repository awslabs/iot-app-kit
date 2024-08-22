import type { AssistantActionEventDetail } from '@iot-app-kit/react-components';
import { useDispatch, useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { onToggleChatbotAction } from '~/store/actions/toggleChatbot';
import { useClients } from '~/components/dashboard/clientContext';
import { useMemo } from 'react';

export const useAssistant = () => {
  const dispatch = useDispatch();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const assistant = useSelector((state: DashboardState) => state.assistant);
  const { iotSiteWiseClient } = useClients();

  const assistantProperties = useMemo(() => {
    if (readOnly && assistant.conversationID) {
      return {
        assistant: {
          client: iotSiteWiseClient,
          conversationID: assistant.conversationID,
          iconPosition: 'topLeft',
          onAction: (event: AssistantActionEventDetail) => {
            if (event.type === 'divedeep') {
              dispatch(
                onToggleChatbotAction({
                  open: true,
                })
              );
            }
          },
        },
      };
    } else {
      return {};
    }
  }, [dispatch, assistant.conversationID, iotSiteWiseClient]);

  return {
    assistantProperties,
  };
};
