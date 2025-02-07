import Box from '@cloudscape-design/components/box';
import Popover from '@cloudscape-design/components/popover';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { useAssistant } from '@iot-app-kit/react-components';
import { type CSSProperties, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AssistantButton } from './assistantButton';
import {
  borderRadiusButton,
  colorBackgroundCellShaded,
  colorBorderDividerDefault,
  colorChartsPurple1200,
  fontSizeBodyM,
  fontWeightHeadingM,
  spaceStaticM,
  spaceStaticS,
  spaceStaticXs,
  spaceStaticXxl,
} from '@cloudscape-design/design-tokens';
import {
  onAssistantCleanWidgetsSelectionAction,
  onToggleAssistantModeAction,
  onToggleChatbotAction,
} from '~/store/actions';
import type { DashboardState } from '~/store/state';
import { VerticalDivider } from '~/features/widget-customization/atoms/vertical-divider';
import { AssistantFloatingMenuRightButton } from './assistantFloatingMenuRightButton';
import { AssistantFloatingMenuCenterButton } from './assistantFloatingMenuCenterButton';
import './assistantFloatingMenu.css';

const menuStyles = {
  height: spaceStaticXxl,
  borderRadius: borderRadiusButton,
  border: `2px solid ${colorChartsPurple1200}`,
  backgroundColor: colorBackgroundCellShaded,
  color: colorChartsPurple1200,
  fontSize: fontSizeBodyM,
  fontWeight: fontWeightHeadingM,
} satisfies CSSProperties;
const MAX_ITEMS_SELECTED = 3;
const CHATBOT_OPENED_WIDTH = 500;
const CHATBOT_CLOSED_WIDTH = 90;

export interface AssistantFloatingMenuProps {
  width: number;
}

export const AssistantFloatingMenu = ({
  width,
}: AssistantFloatingMenuProps) => {
  const dispatch = useDispatch();
  const [isAssistantLoading, setAssistantLoading] = useState<boolean>(false);
  const { startAction, clearAll, messages } = useAssistant({});
  const assistantState = useSelector(
    (state: DashboardState) => state.assistant
  );
  const rightOffset = assistantState.isChatbotOpen
    ? CHATBOT_OPENED_WIDTH
    : CHATBOT_CLOSED_WIDTH;

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      setAssistantLoading(
        lastMessage.sender === 'user' || !!lastMessage.loading
      );
    }
  }, [messages]);

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

  const floatingMenuStyles: CSSProperties = {
    backgroundColor: colorBackgroundCellShaded,
    gap: `${spaceStaticS}`,
    width: `${width - (rightOffset + 40)}px`,
    paddingTop: spaceStaticM,
    right: `${rightOffset + 40}px`,
    zIndex: 1000, // required to fix bug in legends table in the XYplot chart and widget actions
  };

  return (
    <div className='iot-app-kit-assistant-menu-container'>
      <div className='iot-app-kit-assistant-menu' style={floatingMenuStyles}>
        <div
          style={{
            display: 'flex',
            justifyContent:
              assistantState.mode === 'on' ? 'space-between' : 'end',
            marginLeft: spaceStaticXs,
          }}
        >
          {assistantState.mode === 'on' ? (
            <Box variant='span' fontSize='heading-xs'>
              Select the checkboxes in the widgets below and click on Generate
              summary to see the AI generated summaries.
            </Box>
          ) : null}
          <div
            className='iot-app-kit-assistant-menu-buttons-container'
            data-testid='assistant-menu-buttons-container'
            style={{ gap: `${spaceStaticS}`, marginLeft: spaceStaticXs }}
          >
            {assistantState.mode === 'on' ? (
              <div
                className='iot-app-kit-assistant-menu-buttons'
                style={menuStyles}
              >
                <span style={{ padding: `0 ${spaceStaticM}` }}>
                  {showAlert ? (
                    <Box color='text-status-error'>
                      <Popover
                        header='Property limit reached'
                        content='You can select up to 3 properties to summarize using generative AI for now. More options are coming soon.'
                        position='left'
                      >
                        <span className='iot-app-kit-assistant-menu-left-button'>
                          <StatusIndicator type='error'>
                            {totalSelected}/{MAX_ITEMS_SELECTED} items selected
                          </StatusIndicator>
                        </span>
                      </Popover>
                    </Box>
                  ) : (
                    <span className='iot-app-kit-assistant-menu-left-button'>
                      {totalSelected}/{MAX_ITEMS_SELECTED} items selected
                    </span>
                  )}
                </span>
                <VerticalDivider
                  styles={{ width: '1px', height: spaceStaticS }}
                />
                <AssistantFloatingMenuCenterButton
                  label='Clear all'
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
                  label='Generate summary'
                  onClick={handleSummary}
                  disabled={
                    totalSelected === 0 ||
                    totalSelected > MAX_ITEMS_SELECTED ||
                    isAssistantLoading
                  }
                />
              </div>
            ) : null}
            <AssistantButton
              label='AI Assistant'
              onClick={handleToggleAssistantMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
