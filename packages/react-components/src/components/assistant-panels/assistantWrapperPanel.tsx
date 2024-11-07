import { type PropsWithChildren, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import type {
  AssistantProperty,
  AssistantWidgetTypes,
} from '../../common/assistantProps';
import { ResultPanel } from './assistant-result/resultPanel';
import { useAssistant } from '../../hooks/useAssistant/useAssistant';
import './assistantWrapperPanel.css';

export interface AssistantWrapperPanelProps extends PropsWithChildren {
  assistant: AssistantProperty;
  componentType: AssistantWidgetTypes;
  width?: string | number;
  height?: string | number;
}

export const AssistantWrapperPanel = ({
  assistant,
  componentType,
  width,
  height,
  children,
}: AssistantWrapperPanelProps) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const { messages, actionsByComponent } = useAssistant({
    assistantClient: assistant.client,
  });

  const handleDiveDeep = () => {
    if (assistant.onAction) {
      assistant.onAction({
        type: 'divedeep',
        sourceComponentId: assistant.componentId,
        sourceComponentType: componentType,
      });
    }
    setShowResults(false);
  };

  useEffect(() => {
    const componentAction = actionsByComponent[assistant.componentId];
    if (
      componentAction?.action === 'summarize' &&
      componentAction?.target === 'widget'
    ) {
      setShowResults(true);
    }
  }, [actionsByComponent, assistant.componentId]);

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
