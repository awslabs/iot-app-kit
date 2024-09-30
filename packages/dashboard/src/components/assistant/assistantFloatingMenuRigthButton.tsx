import React, { HTMLAttributes } from 'react';
import {
  borderRadiusButton,
  fontSizeBodyM,
  spaceStaticM,
  spaceStaticXxl,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { AssistantIcon } from './assistantIcon';
import './assistantButtons.scss';

interface AssistantFloatingMenuRightButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
}

export const AssistantFloatingMenuRightButton = ({
  label,
  onClick,
  disabled,
}: AssistantFloatingMenuRightButtonProps) => {
  return (
    <button
      className='iot-app-kit-assistant-menu-right-button'
      style={{
        height: spaceStaticXxl,
        borderTopRightRadius: borderRadiusButton,
        borderBottomRightRadius: borderRadiusButton,
        padding: `0 ${spaceStaticM}`,
      }}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      <SpaceBetween direction='horizontal' size='xxs' alignItems='center'>
        <AssistantIcon
          role='img'
          ariaLabel={label}
          style={{ marginTop: spaceStaticXxs }}
        />
        <span style={{ fontSize: fontSizeBodyM }}>{label}</span>
      </SpaceBetween>
    </button>
  );
};
