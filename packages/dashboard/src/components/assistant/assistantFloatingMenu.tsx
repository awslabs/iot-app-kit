import Box from '@cloudscape-design/components/box';
import Popover from '@cloudscape-design/components/popover';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
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
import { useAssistant } from '@iot-app-kit/react-components';
import { type CSSProperties, useEffect, useState } from 'react';
import { useAssistantStore } from '../../features/assistant/useAssistantStore';
import { type DashboardMessages } from '../../messages';
import { VerticalDivider } from '../divider/verticalDivider';
import { AssistantButton } from './assistantButton';
import './assistantFloatingMenu.css';
import { AssistantFloatingMenuCenterButton } from './assistantFloatingMenuCenterButton';
import { AssistantFloatingMenuRightButton } from './assistantFloatingMenuRigthButton';

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
  const [isAssistantLoading, setAssistantLoading] = useState<boolean>(false);
  const { clearAll, messages } = useAssistant({});
  const selectedQueries = useAssistantStore((store) => store.selectedQueries)
  const isChatbotOpen = useAssistantStore((store) => store.isChatbotOpen)
  const mode = useAssistantStore((store) => store.mode)
  const { assistant } = messageOverrides;
  const rightOffset = isChatbotOpen ? CHATBOT_OPENED_WIDTH : CHATBOT_CLOSED_WIDTH;

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

  let totalSelected = 0;
  selectedQueries.forEach(
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

  const menuStyles: CSSProperties = {
    height: spaceStaticXxl,
    borderRadius: borderRadiusButton,
    border: `2px solid ${colorChartsPurple1200}`,
    backgroundColor: colorBackgroundCellShaded,
    color: colorChartsPurple1200,
    fontSize: fontSizeBodyM,
    fontWeight: fontWeightHeadingM,
  };

  return (
    <div className='iot-app-kit-assistant-menu-container'>
      <div className='iot-app-kit-assistant-menu' style={floatingMenuStyles}>
        <div
          style={{
            display: 'flex',
            justifyContent: mode === 'on' ? 'space-between' : 'end',
            marginLeft: spaceStaticXs,
          }}
        >
          {mode === 'on' ? (
            <Box variant='span' fontSize='heading-xs'>
              {assistant.floatingMenu.propertySelection}
            </Box>
          ) : null}
          <div
            className='iot-app-kit-assistant-menu-buttons-container'
            data-testid='assistant-menu-buttons-container'
            style={{ gap: `${spaceStaticS}`, marginLeft: spaceStaticXs }}
          >
            {mode === 'on' ? (
              <div
                className='iot-app-kit-assistant-menu-buttons'
                style={menuStyles}
              >
                <span style={{ padding: `0 ${spaceStaticM}` }}>
                  {showAlert ? (
                    <Box color='text-status-error'>
                      <Popover
                        header={
                          assistant.floatingMenu.error.propertyLimitHeader
                        }
                        content={
                          assistant.floatingMenu.error.propertyLimitMessage
                        }
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
                  disabled={
                    totalSelected === 0 ||
                    totalSelected > MAX_ITEMS_SELECTED ||
                    isAssistantLoading
                  }
                />
              </div>
            ) : null}
            <AssistantButton />
          </div>
        </div>
      </div>
    </div>
  );
};
