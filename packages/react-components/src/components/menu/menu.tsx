import React, { useRef } from 'react';
import type { PropsWithChildren } from 'react';
import {
  borderRadiusDropdown,
  colorBackgroundDropdownItemDefault,
  colorBorderButtonNormalDisabled,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import { useClickAway } from 'react-use';

import { MenuOption, MenuOptionProps } from './option';

import './menu.css';

export type MenuProps = {
  options?: MenuOptionProps[];
  shadow?: boolean;
  onClickOutside?: (e: PointerEvent) => void;
  styles?: React.CSSProperties;
  classNames?: string;
};

const noopClickAway = () => {};

/**
 * Menu component based on cloudscape select: https://cloudscape.design/components/select/?tabId=playground
 * To be used to visualize lists of options that can have actions attached.
 *
 * Options can be added to the menu via the options prop OR by using the <MenuOption /> component as a child
 *
 * Can be positioned relatively or absolutely using the <PositionableMenu /> component
 */
export const Menu: React.FC<PropsWithChildren<MenuProps>> = ({
  onClickOutside,
  children,
  styles,
  classNames,
  options = [],
  shadow = false,
}) => {
  const clickAwayRef = useRef(null);

  useClickAway(clickAwayRef, onClickOutside ?? noopClickAway);

  return (
    <div
      ref={clickAwayRef}
      className={`menu ${shadow ? 'menu-shadow' : ''} ${classNames}`}
      style={{
        border: `${spaceScaledXxxs} solid ${colorBorderButtonNormalDisabled}`,
        borderRadius: borderRadiusDropdown,
        background: colorBackgroundDropdownItemDefault,
        ...styles,
      }}
      onPointerDown={(e) => e.stopPropagation()} // prevent the parent from handling click events
      onPointerUp={(e) => e.stopPropagation()} // prevent the parent from handling click events}
    >
      <ul>
        {children}
        {options.map((option) => (
          <MenuOption key={option.id ?? option.label} {...option} />
        ))}
      </ul>
    </div>
  );
};
