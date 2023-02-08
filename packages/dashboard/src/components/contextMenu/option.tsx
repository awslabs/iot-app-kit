import isHotkey from 'is-hotkey';
import React from 'react';

import './option.css';

export type ContextMenuOptionProps = {
  disabled: boolean;
  text: string;
  hotkey?: string;
  action: () => void;
};

const ContextMenuOption: React.FC<ContextMenuOptionProps> = ({ disabled, text, hotkey, action }) => {
  return (
    <li
      onKeyDown={(e) => {
        if (disabled || !isHotkey('enter', e)) return;
        action();
      }}
      tabIndex={0}
      onClick={() => {
        if (disabled) return;
        action();
      }}
      className={`iot-context-menu-option ${disabled && 'iot-context-menu-option-disabled'}`}
    >
      <div>{text}</div>
      <div>{hotkey}</div>
    </li>
  );
};

export default ContextMenuOption;
