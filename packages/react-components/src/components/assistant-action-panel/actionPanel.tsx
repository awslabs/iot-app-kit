import React, { PropsWithChildren, useState } from 'react';
import Icon from '@cloudscape-design/components/icon';
import { colorBackgroundSegmentDefault, colorTextLabelGenAi } from '@cloudscape-design/design-tokens';
import './actionPanel.css';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { AssistantIcon } from './assistantIcon';
import { AssistantProperty } from '../../common/assistantProps';

export interface ActionPanelProps extends PropsWithChildren {
  position?: 'topLeft' | 'topRight';
  width?: string | number;
  height?: string | number;
}

export const getActionPanelProps = (props: ActionPanelProps, assistant: AssistantProperty) => {
  return {
    position: assistant.iconPosition,
    onAction: assistant.onAction,
    ...props,
  }
}

export const ActionPanel = ({
  position = 'topLeft',
  width,
  height,
  children,
}: ActionPanelProps) => {
  const [showActions, setShowActions] = useState<boolean>(false);

  return (
    <IntlProvider locale='en' defaultLocale='en'>
      <div
        className={`assistant-action-panel selected`}
        style={{ width, height }}
      >
        <div
          className='context-menu'
          style={{
            alignSelf: position === 'topRight' ? 'flex-end' : 'flex-start',
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
              alignSelf: position === 'topRight' ? 'flex-end' : 'flex-start',
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
                  setShowActions(false);
                }}
                aria-label="Summarize button"
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
                onClick={() => {
                  setShowActions(false);
                }}
                aria-label="Chatbot button"
              >
                <Icon name='contact' />{' '}
                <FormattedMessage
                  id='assistant-action-panel.chatbot'
                  defaultMessage='Chatbot'
                  description='Assistant action menu item for opening the chatbot.'
                />
              </button>
            </li>
          </ul>
        )}
        <div
          data-testid='action-panel-children'
          className='child-component'
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    </IntlProvider>
  );
};
