import React, { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import {
  AssistantPopover,
  AssistantPopoverProps,
} from '../assistant-popover/assistantPopover';
import { useAssistant } from '../../../hooks/useAssistant/useAssistant';
import { EVENT_SUMMARY_DEFAULT_UTTERANCE } from '../../assistant-panels/constants';
import {
  AlarmContentContainer,
  AlarmContentContainerProps,
} from '../../alarm-components/alarm-content/alarmContentContainer';

export type AlarmPopoverProps = AssistantPopoverProps &
  AlarmContentContainerProps;

export const AlarmPopover = (props: AlarmPopoverProps) => {
  const { alarmContent, assistant } = props;
  const alarmName = alarmContent?.alarmName;

  const { generateSummary } = useAssistant({
    assistantClient: assistant.client,
  });

  const assistantContext = useMemo(
    () =>
      JSON.stringify({
        assetId: alarmContent?.assetId,
        alarmName,
      }),
    [alarmContent, alarmName]
  );

  const handleSummarize = useCallback(() => {
    generateSummary({
      componentId: assistant.componentId,
      conversationId: assistant.conversationId ?? uuid(),
      context: JSON.stringify(assistantContext),
      utterance: EVENT_SUMMARY_DEFAULT_UTTERANCE,
      target: assistant.target,
    });

    if (assistant.onAction) {
      assistant.onAction({
        type: 'summarize',
        sourceComponentId: assistant.componentId,
      });
    }
  }, [assistant, assistantContext, generateSummary]);

  const content = <AlarmContentContainer alarmContent={alarmContent} />;

  return (
    <AssistantPopover
      {...props}
      handleSummarize={handleSummarize}
      content={content}
    >
      {props.children}
    </AssistantPopover>
  );
};
