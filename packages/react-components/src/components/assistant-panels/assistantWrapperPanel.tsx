import React, { PropsWithChildren, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import type { AssistantProperty } from '../../common/assistantProps';
import { ResultPanel } from './assistant-result/resultPanel';
import { useAssistant } from '../../hooks/useAssistant/useAssistant';
import './assistantWrapperPanel.css';

export interface AssistantWrapperPanelProps extends PropsWithChildren {
  assistant: AssistantProperty;
  width?: string | number;
  height?: string | number;
}

export const AssistantWrapperPanel = ({
  assistant,
  width,
  height,
  children,
}: AssistantWrapperPanelProps) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const { messages, actions } = useAssistant({
    assistantClient: assistant.client,
  });

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

  useEffect(() => {
    const componentAction = actions[assistant.componentId];
    if (
      componentAction?.action === 'summarize' &&
      componentAction?.target === 'widget'
    ) {
      setShowResults(true);
    }
  }, [actions]);

  return (
    <IntlProvider locale='en' defaultLocale='en'>
      <div
        className='assistant-wrapper-panel'
        id={`assistant-action-panel-${assistant.componentId}`}
        style={{ width, height }}
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
