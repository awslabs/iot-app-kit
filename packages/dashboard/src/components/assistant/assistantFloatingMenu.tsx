import React, { CSSProperties, useEffect } from 'react';
import { AssistantButton } from './assistantButton';
import {
  borderRadiusButton,
  colorChartsPurple1200,
  fontSizeBodyM,
  spaceStaticM,
  spaceStaticXxl,
  spaceStaticS,
  fontWeightHeadingM,
  colorBorderDividerDefault,
  colorBackgroundCellShaded,
} from '@cloudscape-design/design-tokens';
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
import Box from '@cloudscape-design/components/box';
import { DashboardMessages } from '~/messages';
import { useAssistant } from '@iot-app-kit/react-components';

const MAX_ITEMS_SELECTED = 3;
const CHATBOT_OPENED_WIDTH = 500;
const CHATBOT_CLOSED_WIDTH = 90;

export const AssistantFloatingMenu = ({
  width,
  messageOverrides,
}: {
  width: number;
  messageOverrides: DashboardMessages;
}) => {
  const dispatch = useDispatch();
  const { startAction, clearAll } = useAssistant({});
  const assistantState = useSelector(
    (state: DashboardState) => state.assistant
  );
  const { assistant } = messageOverrides;
  const rightOffset = assistantState.isChatbotOpen
    ? CHATBOT_OPENED_WIDTH
    : CHATBOT_CLOSED_WIDTH;

  useEffect(() => {
    clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      })
    );
  };

  let totalSelected = 0;
  assistantState.selectedQueries.forEach(
    (q) => (totalSelected += q.selectedProperties)
  );
  const showAlert = totalSelected > MAX_ITEMS_SELECTED;

  const mainContainerStyles: CSSProperties = {
    minHeight: `${showAlert ? '140' : '80'}px`,
    width: 'fit-content',
  };

  const floatingMenuStyles: CSSProperties = {
    backgroundColor: colorBackgroundCellShaded,
    display: 'flex',
    flexDirection: 'column',
    gap: `${spaceStaticS}`,
    position: 'fixed',
    width: `${width - (rightOffset + 40)}px`,
    paddingTop: spaceStaticM,
    left: spaceStaticS,
    right: `${rightOffset + 40}px`,
    zIndex: 1000, // required to fix bug in legends table in the XYplot chart and widget actions
  };

  const menuStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: spaceStaticXxl,
    padding: 0,
    borderRadius: borderRadiusButton,
    border: `2px solid ${colorChartsPurple1200}`,
    backgroundColor: colorBackgroundCellShaded,
    color: colorChartsPurple1200,
    width: 'fit-content',
    fontSize: fontSizeBodyM,
    fontWeight: fontWeightHeadingM,
  };

  const menuContainerStyles: CSSProperties = {
    display: 'flex',
    gap: `${spaceStaticS}`,
    flexWrap: 'wrap',
    alignItems: 'end',
    marginLeft: 'auto',
    justifyContent: 'end',
  };

  return (
    <div style={mainContainerStyles}>
      <div style={floatingMenuStyles}>
        {showAlert ? (
          <Alert
            statusIconAriaLabel={assistant.floatingMenu.error.ariaLabel}
            type='error'
          >
            {assistant.floatingMenu.error.propertyLimitMessage}
          </Alert>
        ) : null}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {assistantState.mode === 'on' ? (
            <Box variant='span' fontSize='heading-xs'>
              {assistant.floatingMenu.propertySelection}
            </Box>
          ) : null}
          <div style={menuContainerStyles}>
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
                  styles={{
                    width: '2px',
                    height: '100%',
                    backgroundColor:
                      totalSelected === 0 || totalSelected > MAX_ITEMS_SELECTED
                        ? colorBorderDividerDefault
                        : colorChartsPurple1200,
                  }}
                />
                <AssistantFloatingMenuRightButton
                  messageOverrides={messageOverrides}
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
          </div>
        </div>
      </div>
    </div>
  );
};
