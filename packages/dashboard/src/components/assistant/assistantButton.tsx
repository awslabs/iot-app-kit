import { type HTMLAttributes } from 'react';
import { AssistantIcon } from './assistantIcon';
import {
  borderRadiusButton,
  colorBackgroundButtonNormalDefault,
  colorChartsPurple1200,
  fontSizeBodyM,
  spaceStaticL,
  spaceStaticXs,
  spaceStaticXxl,
  spaceStaticXxs,
} from '@cloudscape-design/design-tokens';
import SpaceBetween from '@cloudscape-design/components/space-between';

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
        border: `2px solid ${colorChartsPurple1200}`,
        borderRadius: borderRadiusButton,
        background: colorChartsPurple1200,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <SpaceBetween direction='horizontal' size='xs' alignItems='center'>
        <AssistantIcon
          role='img'
          ariaLabel={label}
          style={{ marginTop: spaceStaticXxs, color: 'white' }}
        />
        <span
          style={{
            fontSize: fontSizeBodyM,
            color: colorBackgroundButtonNormalDefault,
          }}
        >
          {label}
        </span>
      </SpaceBetween>
    </button>
  );
};
