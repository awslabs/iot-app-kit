import React, { HTMLAttributes } from 'react';
import {
  borderRadiusButton,
  colorTextButtonNormalDisabled,
  fontSizeBodyM,
  fontWeightHeadingM,
  spaceStaticM,
  spaceStaticXxl,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { AssistantIcon } from './assistantIcon';
import './assistantButtons.css';
import Popover from '@cloudscape-design/components/popover';
import type { DashboardMessages } from '~/messages';

interface AssistantFloatingMenuRightButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  messageOverrides: DashboardMessages;
  disabled?: boolean;
}

export const AssistantFloatingMenuRightButton = ({
  label,
  onClick,
  disabled,
  messageOverrides,
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
      <SpaceBetween direction='horizontal' size='xxs' alignItems='center'>
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
      </SpaceBetween>
    </button>
  );

  if (disabled) {
    return (
      <Popover
        content={
          messageOverrides.assistant.floatingMenu.buttonGenerateSummaryPopover
        }
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
