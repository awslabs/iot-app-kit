import React, { CSSProperties } from 'react';
import { AssistantButton } from './assistantButton';
import {
  borderRadiusButton,
  colorChartsPurple1200,
  colorBackgroundButtonNormalDefault,
  fontSizeBodyM,
  spaceStaticL,
  spaceStaticM,
  spaceStaticXxl,
  spaceStaticS,
} from '@cloudscape-design/design-tokens';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { VerticalDivider } from '../divider/verticalDivider';
import { AssistantFloatingMenuRightButton } from './assistantFloatingMenuRigthButton';
import { AssistantFloatingMenuCenterButton } from './assistantFloatingMenuCenterButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  onAssistantCleanWidgetsSelectionAction,
  onToggleAssistantModeAction,
  onToggleChatbotAction,
} from '~/store/actions';
import type { DashboardState } from '~/store/state';
import Alert from '@cloudscape-design/components/alert';
import { DashboardMessages } from '~/messages';
import { useAssistant } from '@iot-app-kit/react-components';

const MAX_ITEMS_SELECTED = 3;
const CHATBOT_OPENED_WIDTH = 500;
const CHATBOT_CLOSED_WIDTH = 90;

export const AssistantFloatingMenu = ({
  messageOverrides,
}: {
  messageOverrides: DashboardMessages;
}) => {
  const dispatch = useDispatch();
  const { startAction } = useAssistant({});
  const assistantState = useSelector(
    (state: DashboardState) => state.assistant
  );
  const { assistant } = messageOverrides;
  const rightOffset = assistantState.isChatbotOpen
    ? CHATBOT_OPENED_WIDTH
    : CHATBOT_CLOSED_WIDTH;
  const handleToggleAssistantMode = () => {
    dispatch(
      onToggleAssistantModeAction({
        mode: assistantState.mode === 'on' ? 'off' : 'on',
      })
    );
  };

  const handleClearAll = () => {
    assistantState.selectedQueries
      .filter((item) => ['chart', 'table'].includes(item.widgetType))
      .forEach((query) => {
        startAction({
          target: 'widget',
          componentId: query.widgetId,
          action: 'clear-selection',
        });
      });
    dispatch(onAssistantCleanWidgetsSelectionAction());
  };

  const handleSummary = () => {
    dispatch(
      onToggleChatbotAction({
        open: true,
        callerComponentId: 'dashboard',
        action: 'summarize',
        messages: [],
      })
    );
  };

  const mainContainerStyles: CSSProperties = {
    minHeight: '60px',
  };

  const floatingMenuStyles: CSSProperties = {
    display: 'flex',
    position: 'fixed',
    width: `calc(100vw - ${rightOffset + 40}px)`,
    padding: spaceStaticM,
    zIndex: 1000, // required to fix bug in legends table in the XYplot chart and widget actions
  };

  const menuStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: spaceStaticXxl,
    padding: 0,
    borderRadius: borderRadiusButton,
    border: `1px solid ${colorChartsPurple1200}`,
    background: colorChartsPurple1200,
    color: colorBackgroundButtonNormalDefault,
    width: 'fit-content',
    fontSize: fontSizeBodyM,
  };

  let totalSelected = 0;
  assistantState.selectedQueries.forEach(
    (q) => (totalSelected += q.selectedProperties)
  );

  return (
    <div style={mainContainerStyles}>
      <div style={floatingMenuStyles}>
        {totalSelected > MAX_ITEMS_SELECTED ? (
          <div style={{ width: 'fit-content' }}>
            <Alert
              statusIconAriaLabel={assistant.floatingMenu.error.ariaLabel}
              type='error'
            >
              {assistant.floatingMenu.error.propertyLimitMessage}
            </Alert>
          </div>
        ) : null}
        <div
          style={{
            marginLeft: 'auto',
          }}
        >
          <SpaceBetween direction='vertical' size='m' alignItems='end'>
            <SpaceBetween direction='horizontal' size='m'>
              {assistantState.mode === 'on' ? (
                <div style={menuStyles}>
                  <span style={{ padding: `0 ${spaceStaticM}` }}>
                    {totalSelected}/{MAX_ITEMS_SELECTED} items selected
                  </span>
                  <VerticalDivider
                    styles={{ width: '1px', height: spaceStaticS }}
                  />
                  <AssistantFloatingMenuCenterButton
                    label={assistant.floatingMenu.buttonClearAll}
                    onClick={handleClearAll}
                    disabled={totalSelected === 0}
                  />
                  <VerticalDivider
                    styles={{ width: '2px', height: spaceStaticL }}
                  />
                  <AssistantFloatingMenuRightButton
                    label={assistant.floatingMenu.buttonGenerateSummary}
                    onClick={handleSummary}
                    disabled={
                      totalSelected === 0 || totalSelected > MAX_ITEMS_SELECTED
                    }
                  />
                </div>
              ) : null}
              <AssistantButton
                label={assistant.floatingMenu.buttonAIAssistant}
                onClick={handleToggleAssistantMode}
              />
            </SpaceBetween>
          </SpaceBetween>
        </div>
      </div>
    </div>
  );
};
