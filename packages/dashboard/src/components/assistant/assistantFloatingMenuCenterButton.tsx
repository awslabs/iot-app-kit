import {
  fontSizeBodyM,
  fontWeightHeadingM,
  spaceStaticM,
  spaceStaticXxl,
} from '@cloudscape-design/design-tokens';
import { type HTMLAttributes } from 'react';

export interface AssistantFloatingMenCenterButtonProps
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
        fontSize: fontSizeBodyM,
      }}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      <span style={{ fontSize: fontSizeBodyM, fontWeight: fontWeightHeadingM }}>
        {label}
      </span>
    </button>
  );
};
