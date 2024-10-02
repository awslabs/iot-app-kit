import React, { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { Box, SpaceBetween } from '@cloudscape-design/components';
import {
  AssistantPopover,
  AssistantPopoverProps,
} from '../assistant-popover/assistantPopover';
import { AlarmContent } from '../../alarm-state/types';
import { useAssistant } from '../../../hooks/useAssistant/useAssistant';
import { EVENT_SUMMARY_DEFAULT_UTTERANCE } from '../../assistant-panels/constants';

export interface AlarmPopoverProps extends AssistantPopoverProps {
  icon?: JSX.Element | null;
  alarmContent?: AlarmContent;
}

export const AlarmPopover = (props: AlarmPopoverProps) => {
  const { icon, alarmContent, assistant } = props;
  const alarmName = alarmContent?.alarmName;

  const { messages, generateSummary } = useAssistant({
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
        messages,
      });
    }
  }, [assistant, assistantContext, generateSummary, messages]);

  const title = (
    <div className='alarm-popup-title'>
      <SpaceBetween direction='horizontal' size='xxs'>
        {icon}
        <Box fontWeight='bold'>{alarmContent?.alarmName}</Box>
      </SpaceBetween>
    </div>
  );

  const ruleExpression = (
    <Box color='text-body-secondary' fontWeight='light'>
      {alarmContent?.alarmExpression
        ? `Rule expression: ${alarmContent?.alarmExpression}`
        : ''}
    </Box>
  );

  const severity = (
    <Box color='text-body-secondary' fontWeight='light'>
      {alarmContent?.severity ? `Severity: ${alarmContent?.severity}` : ''}
    </Box>
  );

  const content = (
    <div className='alarm-popup-content'>
      <SpaceBetween direction='vertical' size='xs'>
        {title}
        {severity}
        {ruleExpression}
      </SpaceBetween>
    </div>
  );

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
