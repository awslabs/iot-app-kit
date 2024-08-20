import React, { PropsWithChildren, useEffect, useState } from 'react';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';
import {
  colorBorderDropdownItemHover,
  colorChartsLineGrid,
  colorTextLabelGenAi,
  colorTextHomeHeaderDefault,
} from '@cloudscape-design/design-tokens';
import './actionPanel.css';
import { FormattedMessage, IntlProvider } from 'react-intl';

const assistantIcon = (
  <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
    <g transform='translate(-6 -6)'>
      <path
        d='M14 7L15.9799 12.0201L21 14L15.9799 15.9799L14 21L12.0201 15.9799L7 14L12.0201 12.0201L14 7Z'
        stroke={colorTextLabelGenAi}
        strokeWidth='2'
        strokeLinejoin='round'
      />
      <path
        d='M8.5 6L9.2955 7.7045L11 8.5L9.2955 9.2955L8.5 11L7.7045 9.2955L6 8.5L7.7045 7.7045L8.5 6Z'
        fill={colorTextLabelGenAi}
      />
    </g>
  </svg>
);

export interface ActionPanelProps extends PropsWithChildren {
  position?: 'left' | 'right';
  width?: string | number;
  height?: string | number;
}

export const ActionPanel = ({
  position = 'right',
  width,
  height,
  children,
}: ActionPanelProps) => {
  const [showActions, setShowActions] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (!selected) {
      setShowActions(false);
    }
  }, [selected]);

  return (
    <IntlProvider locale='en' defaultLocale='en'>
      <div
        className={`assistant-action-panel ${selected ? 'selected' : ''}`}
        style={{ width, height }}
      >
        <div
          className='context-menu'
          style={{
            alignSelf: position === 'right' ? 'flex-end' : 'flex-start',
            border: `1px solid ${colorTextHomeHeaderDefault}`,
          }}
        >
          <SpaceBetween direction='horizontal' size='xs'>
            <div className='panelSelection'>
              <FormattedMessage
                id='assistant-action-panel.numSelected'
                defaultMessage='1 panel selected'
                description='Number of panels selected.'
              />
            </div>
            <button
              data-testid='action-panel-menu-button'
              onClick={() => setShowActions(!showActions)}
            >
              {assistantIcon}{' '}
              <FormattedMessage
                id='assistant-action-panel.deepDive'
                defaultMessage='Deep dive'
                description='Deep dive button to open assistant action menu'
              />
            </button>
          </SpaceBetween>
        </div>
        {showActions && (
          <ul
            className='action-dropdown'
            style={{
              alignSelf: position === 'right' ? 'flex-end' : 'flex-start',
              background: colorChartsLineGrid,
              border: `2px solid ${colorBorderDropdownItemHover}`,
            }}
          >
            <li
              style={{
                borderBottom: `0.5px solid ${colorBorderDropdownItemHover}`,
              }}
            >
              <button
                data-testid='action-panel-summarize-button'
                onClick={() => {
                  setShowActions(false);
                }}
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
          role='button'
          tabIndex={0}
          onClick={() => setSelected(!selected)}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget && event.key === 'Enter')
              setSelected(!selected);
          }}
        >
          {children}
        </div>
      </div>
    </IntlProvider>
  );
};
