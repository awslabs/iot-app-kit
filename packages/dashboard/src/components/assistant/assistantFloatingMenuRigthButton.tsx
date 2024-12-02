import Icon from '@cloudscape-design/components/icon';
import Popover from '@cloudscape-design/components/popover';
import {
  borderRadiusButton,
  colorTextButtonNormalDisabled,
  fontSizeBodyM,
  fontWeightHeadingM,
  spaceStaticM,
  spaceStaticXxl,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';
import { useAssistantStore } from '../../features/assistant/useAssistantStore';

interface AssistantFloatingMenuRightButtonProps {
  disabled?: boolean;
}

export const AssistantFloatingMenuRightButton = ({
  disabled,
}: AssistantFloatingMenuRightButtonProps) => {
  const toggleChatbot = useAssistantStore((store) => store.toggleChatbot)

  const handleSummary = () => {
    toggleChatbot({
      open: true,
      callerComponentId: 'dashboard',
      action: 'summarize',
    })
  };

  const buttonComponent = (
    <button
      className='iot-app-kit-assistant-menu-right-button'
      style={{
        height: spaceStaticXxl,
        borderTopRightRadius: borderRadiusButton,
        borderBottomRightRadius: borderRadiusButton,
        padding: `0 ${spaceStaticM}`,
        ...(disabled
          ? {
              color: colorTextButtonNormalDisabled,
            }
          : {}),
      }}
      aria-label='Generate summary'
      onClick={disabled ? () => {} : handleSummary}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spaceStaticXxs,
          flexWrap: 'nowrap',
        }}
      >
        <Icon name="gen-ai" />
        <span
          style={{ fontSize: fontSizeBodyM, fontWeight: fontWeightHeadingM }}
        >
          Generate summary
        </span>
      </div>
    </button>
  );

  if (disabled) {
    return (
      <Popover
        content='Select the widgets or properties below to include them to generate an AI summary.'
        triggerType='custom'
        position='left'
      >
        {buttonComponent}
      </Popover>
    );
  } else {
    return buttonComponent;
  }
};
