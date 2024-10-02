import React, { HTMLAttributes } from 'react';
import { AssistantIcon } from './assistantIcon';
import {
  borderRadiusButton,
  fontSizeBodyM,
  spaceStaticL,
  spaceStaticXs,
  spaceStaticXxl,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';
import SpaceBetween from '@cloudscape-design/components/space-between';
import './assistantButtons.css';

interface AssistantButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const AssistantButton = ({ label, onClick }: AssistantButtonProps) => {
  return (
    <button
      className='iot-app-kit-assistant-button'
      style={{
        height: spaceStaticXxl,
        padding: `0 ${spaceStaticL}`,
        gap: spaceStaticXs,
        borderRadius: borderRadiusButton,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <SpaceBetween direction='horizontal' size='xs' alignItems='center'>
        <AssistantIcon
          role='img'
          ariaLabel={label}
          style={{ marginTop: spaceStaticXxs }}
        />
        <span style={{ fontSize: fontSizeBodyM, fontWeight: 'bold' }}>
          {label}
        </span>
      </SpaceBetween>
    </button>
  );
};
