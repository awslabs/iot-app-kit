import {
  fontSizeBodyM,
  fontWeightHeadingM,
  spaceStaticM,
  spaceStaticXxl,
} from '@cloudscape-design/design-tokens';
import { useAssistant } from '@iot-app-kit/react-components';
import { useAssistantStore } from '../../features/assistant/useAssistantStore';

interface AssistantFloatingMenCenterButtonProps {
  disabled?: boolean;
}

export const AssistantFloatingMenuCenterButton = ({
  disabled,
}: AssistantFloatingMenCenterButtonProps) => {
  const selectedQueries = useAssistantStore((store) => store.selectedQueries)
  const assistantCleanWidgetsSelection = useAssistantStore((store) => store.assistantCleanWidgetsSelection)
  const { startAction } = useAssistant({});

  const handleClearAll = () => {
    selectedQueries
      .filter((item) => ['chart', 'table'].includes(item.widgetType))
      .forEach((query) => {
        startAction({
          target: 'widget',
          componentId: query.widgetId,
          action: 'clear-selection',
        });
      });

    assistantCleanWidgetsSelection()
  };

  return (
    <button
      className='iot-app-kit-assistant-menu-center-button'
      style={{
        height: spaceStaticXxl,
        padding: `0 ${spaceStaticM}`,
        fontSize: fontSizeBodyM,
      }}
      aria-label="Clear all"
      onClick={handleClearAll}
      disabled={disabled}
    >
      <span style={{ fontSize: fontSizeBodyM, fontWeight: fontWeightHeadingM }}>
        Clear all
      </span>
    </button>
  );
};
