import React, { HTMLAttributes } from 'react';
import {
  fontSizeBodyM,
  spaceStaticM,
  spaceStaticXxl,
} from '@cloudscape-design/design-tokens';
import './assistantButtons.scss';

interface AssistantFloatingMenCenterButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
}

export const AssistantFloatingMenuCenterButton = ({
  label,
  onClick,
  disabled,
}: AssistantFloatingMenCenterButtonProps) => {
  return (
    <button
      className='iot-app-kit-assistant-menu-center-button'
      style={{
        height: spaceStaticXxl,
        padding: `0 ${spaceStaticM}`,
      }}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      <span style={{ fontSize: fontSizeBodyM }}>{label}</span>
    </button>
  );
};
