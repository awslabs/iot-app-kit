import {
  borderRadiusDropdown,
  colorBackgroundControlDisabled,
  colorBackgroundDropdownItemHover,
  colorBorderControlDefault,
  spaceScaledL,
  spaceScaledXs,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { isHotkey } from 'is-hotkey';
import { type CSSProperties, useState } from 'react';
import './option.css';

const disabledStyle = {
  color: colorBackgroundControlDisabled,
  cursor: 'not-allowed',
} satisfies CSSProperties;

const hoverStyle = {
  backgroundColor: colorBackgroundDropdownItemHover,
  border: `${spaceScaledXxxs} solid ${colorBorderControlDefault}`,
} satisfies CSSProperties;

const nonHoverStyle = {
  border: `${spaceScaledXxxs} solid rgba(0,0,0,0)`,
} satisfies CSSProperties;

export interface ContextMenuOptionProps {
  disabled: boolean;
  text: string;
  hotkey?: string;
  action: VoidFunction;
}

export const ContextMenuOption = ({
  disabled,
  text,
  hotkey,
  action,
}: ContextMenuOptionProps) => {
  const [hover, setHover] = useState(false);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      onKeyDown={(e) => {
        if (disabled || !isHotkey('enter', e)) return;
        action();
      }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onClick={() => {
        if (disabled) return;
        action();
      }}
      style={{
        ...(hover ? hoverStyle : nonHoverStyle),
        ...(disabled && disabledStyle),
        padding: `${spaceScaledXs} ${spaceScaledL}`,
        lineHeight: spaceScaledL,
        borderRadius: borderRadiusDropdown,
      }}
      className='iot-context-menu-option'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div>{text}</div>
      <div>{hotkey}</div>
    </li>
  );
};
