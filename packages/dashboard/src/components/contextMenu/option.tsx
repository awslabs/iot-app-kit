import { isHotkey } from 'is-hotkey';
import { useState } from 'react';

import {
  borderRadiusDropdown,
  colorBackgroundControlDisabled,
  colorBackgroundDropdownItemHover,
  colorBorderControlDefault,
  spaceScaledL,
  spaceScaledXs,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import './option.css';

export type ContextMenuOptionProps = {
  disabled: boolean;
  text: string;
  hotkey?: string;
  action: () => void;
};

const ContextMenuOption: React.FC<ContextMenuOptionProps> = ({
  disabled,
  text,
  hotkey,
  action,
}) => {
  const [hover, setHover] = useState(false);

  let hoverStyle;
  if (hover) {
    hoverStyle = {
      backgroundColor: colorBackgroundDropdownItemHover,
      border: `${spaceScaledXxxs} solid ${colorBorderControlDefault}`,
    };
  } else {
    hoverStyle = {
      border: `${spaceScaledXxxs} solid rgba(0,0,0,0)`,
    };
  }

  const disabledStyle = {
    color: colorBackgroundControlDisabled,
    cursor: 'not-allowed',
  };
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
        ...hoverStyle,
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

export default ContextMenuOption;
