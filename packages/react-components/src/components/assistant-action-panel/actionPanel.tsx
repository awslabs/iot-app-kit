import React, { PropsWithChildren, useState } from 'react';
import Icon from '@cloudscape-design/components/icon';
import {
  colorBackgroundSegmentDefault,
  colorTextLabelGenAi,
} from '@cloudscape-design/design-tokens';
import { FormattedMessage, IntlProvider } from 'react-intl';
import type { AssistantProperty } from '../../common/assistantProps';
import { AssistantIcon } from './assistantIcon';
import { useAssistant } from '../../hooks/useAssistant/useAssistant';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import { SITUATION_SUMMARY_DEFAULT_UTTERANCE } from './constants';
import { v4 as uuid } from 'uuid';
import './actionPanel.css';
import { ResultPanel } from './assistant-result/resultPanel';

export interface ActionPanelProps extends PropsWithChildren {
  componentId: string;
  assistant: AssistantProperty;
  iconPosition?: 'topLeft' | 'topRight';
  width?: string | number;
  height?: string | number;
}

export const ActionPanel = ({
  assistant,
  componentId,
  iconPosition = 'topLeft',
  width,
  height,
  children,
}: ActionPanelProps) => {
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const { getContextByComponent } = useAssistantContext();

  const { messages, generateSummary } = useAssistant({
    assistantClient: assistant.client,
  });

  const handleSummary = () => {
    generateSummary(
      assistant.conversationID ?? uuid(),
      getContextByComponent(componentId),
      SITUATION_SUMMARY_DEFAULT_UTTERANCE
    );

    if (assistant.onAction) {
      assistant.onAction({
        type: 'summarize',
        sourceComponentId: componentId,
      });
    }
  };

  const handleDiveDeep = () => {
    if (assistant.onAction) {
      assistant.onAction({
        type: 'divedeep',
        sourceComponentId: componentId,
      });
    }
    setShowActions(false);
  };

  return (
    <IntlProvider locale='en' defaultLocale='en'>
      <div
        className='assistant-action-panel selected'
        id={`assistant-action-panel-${componentId}`}
        style={{ width, height }}
      >
        {children}
        <div
          className='context-menu'
          style={{
            alignSelf: iconPosition === 'topRight' ? 'flex-end' : 'flex-start',
            color: `2px solid ${colorBackgroundSegmentDefault}`,
          }}
        >
          <button
            data-testid='action-panel-menu-button'
            onClick={() => setShowActions(!showActions)}
          >
            <AssistantIcon />
          </button>
        </div>
        {showActions && (
          <ul
            className='action-dropdown'
            style={{
              alignSelf:
                iconPosition === 'topRight' ? 'flex-end' : 'flex-start',
              border: `2px solid ${colorTextLabelGenAi}`,
              backgroundColor: colorBackgroundSegmentDefault,
            }}
          >
            <li
              style={{
                borderBottom: `0.5px solid ${colorTextLabelGenAi}`,
              }}
            >
              <button
                data-testid='action-panel-summarize-button'
                onClick={() => {
                  handleSummary();
                  setShowActions(false);
                  setShowResults(true);
                }}
                aria-label='Summarize'
              >
                <FormattedMessage
                  id='assistant-action-panel.summarize'
                  defaultMessage='Summarize'
                  description='Assistant action menu item for summarizing the selected panel.'
                />
              </button>
            </li>
            <li>
              <button
                data-testid='action-panel-chatbot-button'
                onClick={handleDiveDeep}
                aria-label='Chat'
              >
                <Icon name='contact' />{' '}
                <FormattedMessage
                  id='assistant-action-panel.chatbot'
                  defaultMessage='Chat'
                  description='Assistant action menu item for opening the chatbot.'
                />
              </button>
            </li>
          </ul>
        )}
        {showResults ? (
          <ResultPanel
            componentId={componentId}
            actionPosition={iconPosition}
            messages={messages}
            onClose={() => setShowResults(false)}
            onDivedeep={handleDiveDeep}
          />
        ) : null}
      </div>
    </IntlProvider>
  );
};
