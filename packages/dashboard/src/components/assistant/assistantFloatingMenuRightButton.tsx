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
import { type HTMLAttributes } from 'react';
import { AssistantIcon } from './assistantIcon';

export interface AssistantFloatingMenuRightButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
}

export const AssistantFloatingMenuRightButton = ({
  label,
  onClick,
  disabled,
}: AssistantFloatingMenuRightButtonProps) => {
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
      aria-label={label}
      onClick={disabled ? () => {} : onClick}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spaceStaticXxs,
          flexWrap: 'nowrap',
        }}
      >
        <AssistantIcon
          role='img'
          ariaLabel={label}
          style={{ marginTop: spaceStaticXxs }}
        />
        <span
          style={{ fontSize: fontSizeBodyM, fontWeight: fontWeightHeadingM }}
        >
          {label}
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
