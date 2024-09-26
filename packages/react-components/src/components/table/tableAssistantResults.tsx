import React, { PropsWithChildren, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import type { AssistantProperty } from '../../common/assistantProps';
import { useAssistant } from '../../hooks/useAssistant/useAssistant';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import { v4 as uuid } from 'uuid';
import { ResultPanel } from '../assistant-action-panel/assistant-result/resultPanel';
import { SITUATION_SUMMARY_DEFAULT_UTTERANCE } from '../assistant-action-panel/constants';
import '../assistant-action-panel/actionPanel.css';

export interface TableAssistantResultsProps extends PropsWithChildren {
  assistant: AssistantProperty;
  showSummarization: boolean;
  onSummarizationEnd: () => void;
}

export const TableAssistantResults = ({
  assistant,
  showSummarization,
  onSummarizationEnd,
  children,
}: TableAssistantResultsProps) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const { getContextByComponent } = useAssistantContext();

  const { messages, generateSummary } = useAssistant({
    assistantClient: assistant.client,
  });

  const handleSummary = () => {
    generateSummary({
      componentId: assistant.componentId,
      conversationId: assistant.conversationId ?? uuid(),
      context: getContextByComponent(assistant.componentId),
      utterance: SITUATION_SUMMARY_DEFAULT_UTTERANCE,
    });

    if (assistant.onAction) {
      assistant.onAction({
        type: 'summarize',
        sourceComponentId: assistant.componentId,
        messages,
      });
    }
    setShowResults(true);
    onSummarizationEnd();
  };

  useEffect(() => {
    if (showSummarization) {
      handleSummary();
    }
  }, [showSummarization]);

  const handleDiveDeep = () => {
    if (assistant.onAction) {
      assistant.onAction({
        type: 'divedeep',
        sourceComponentId: assistant.componentId,
        messages,
      });
    }
    setShowResults(false);
  };

  return (
    <IntlProvider locale='en' defaultLocale='en'>
      <div
        className='assistant-action-panel selected'
        id={`assistant-action-panel-${assistant.componentId}`}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
        {showResults ? (
          <ResultPanel
            componentId={assistant.componentId}
            actionPosition='topRight'
            messages={messages}
            onClose={() => setShowResults(false)}
            onDivedeep={handleDiveDeep}
          />
        ) : null}
      </div>
    </IntlProvider>
  );
};
