import React, { PropsWithChildren, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import type { AssistantProperty } from '../../common/assistantProps';
import { useAssistant } from '../../hooks/useAssistant/useAssistant';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import { v4 as uuid } from 'uuid';
import { ResultPanel } from '../assistant-panels/assistant-result/resultPanel';
import { SITUATION_SUMMARY_DEFAULT_UTTERANCE } from '../assistant-panels/constants';
import '../assistant-panels/assistantWrapperPanel.css';

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
      target: assistant.target,
      conversationId: assistant.conversationId ?? uuid(),
      context: getContextByComponent(assistant.componentId),
      utterance: SITUATION_SUMMARY_DEFAULT_UTTERANCE,
    });

    if (assistant.onAction) {
      assistant.onAction({
        type: 'summarize',
        sourceComponentId: assistant.componentId,
        sourceComponentType: 'table',
      });
    }

    if (assistant.target === 'widget') {
      setShowResults(true);
    }
    onSummarizationEnd();
  };

  useEffect(() => {
    if (showSummarization) {
      handleSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSummarization]);

  const handleDiveDeep = () => {
    if (assistant.onAction) {
      assistant.onAction({
        type: 'divedeep',
        sourceComponentId: assistant.componentId,
        sourceComponentType: 'table',
      });
    }
    setShowResults(false);
  };

  return (
    <IntlProvider locale='en' defaultLocale='en'>
      <div
        className='assistant-panels selected'
        id={`assistant-panels-${assistant.componentId}`}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
        {showResults ? (
          <ResultPanel
            componentId={assistant.componentId}
            messages={messages}
            onClose={() => setShowResults(false)}
            onDivedeep={handleDiveDeep}
          />
        ) : null}
      </div>
    </IntlProvider>
  );
};
