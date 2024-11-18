import {
  borderRadiusDropdown,
  colorBackgroundControlDisabled,
  colorBackgroundDropdownItemHover,
  colorBorderControlDefault,
  colorBorderDividerDefault,
  spaceScaledL,
  spaceScaledXs,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { isHotkey } from 'is-hotkey';
import {
  type PointerEventHandler,
  type PropsWithChildren,
  useState,
} from 'react';
import './option.css';

const isPointerEvent = (
  e: React.MouseEvent | React.KeyboardEvent
): e is React.MouseEvent => e.type === 'click';
const isEnterEvent = (
  e: React.MouseEvent | React.KeyboardEvent
): e is React.KeyboardEvent => !isPointerEvent(e) && isHotkey('enter', e);

export type MenuOptionProps = {
  id?: string;
  disabled?: boolean;
  label?: string;
  classNames?: string;
  styles?: React.CSSProperties;
  highlighted?: boolean;
  iconStart?: () => React.ReactElement | React.ReactNode;
  iconEnd?: () => React.ReactElement | React.ReactNode;
  onPointerEnter?: (e: React.PointerEvent) => void;
  onPointerLeave?: (e: React.PointerEvent) => void;
  action?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onKeyboardEnter?: (e: React.KeyboardEvent) => void;
};

/**
 * Menu option component.
 *
 * Used as a child of the Menu component.
 * Allows you to declare the text, and icons within the component
 * and any action callbacks
 *
 * action is a generic handler for click and enter
 */
export const MenuOption: React.FC<PropsWithChildren<MenuOptionProps>> = ({
  disabled,
  label,
  classNames,
  styles,
  children,
  highlighted,
  iconStart,
  iconEnd,
  onPointerEnter,
  onPointerLeave,
  onClick,
  onKeyboardEnter,
  action,
}) => {
  const [hover, setHover] = useState(false);

  const handlePointerEnter: PointerEventHandler = (e) => {
    setHover(true);
    onPointerEnter && onPointerEnter(e);
  };
  const handlePointerLeave: PointerEventHandler = (e) => {
    setHover(false);
    onPointerLeave && onPointerLeave(e);
  };

  const handleAction = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (disabled) return;
    else if (action && (isEnterEvent(e) || isPointerEvent(e))) action(e);
    else if (onKeyboardEnter && isEnterEvent(e)) onKeyboardEnter(e);
    else if (onClick && isPointerEvent(e)) onClick(e);
  };

  const hoverStyle = (hover || highlighted) && {
    backgroundColor: colorBackgroundDropdownItemHover,
    boxShadow: `0 0 0 ${spaceScaledXxxs} ${colorBorderControlDefault}`,
  };

  const borderRadius = hover ? borderRadiusDropdown : 0;

  const disabledStyle = {
    color: colorBackgroundControlDisabled,
    cursor: 'not-allowed',
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onKeyDown={handleAction}
      onClick={handleAction}
      style={{
        ...hoverStyle,
        ...(disabled && disabledStyle),
        padding: `${spaceScaledXs} ${spaceScaledL}`,
        lineHeight: spaceScaledL,
        borderRadius,
        borderBottom: `1px solid ${colorBorderDividerDefault}`,
        ...styles,
      }}
      className={`menu-option ${classNames}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {iconStart && (
        <div className='menu-option-icon menu-option-icon-start'>
          {iconStart()}
        </div>
      )}
      <div className='menu-option-label'>
        {children}
        {label}
      </div>
      {iconEnd && (
        <div className='menu-option-icon menu-option-icon-end'>{iconEnd()}</div>
      )}
    </li>
  );
};
