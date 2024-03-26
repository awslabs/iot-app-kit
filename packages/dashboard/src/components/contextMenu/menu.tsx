import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import flip from '@popperjs/core/lib/modifiers/flip';
import './menu.css';
import { useClickOutside } from '~/hooks/useClickOutside';
import type { ReactNode } from 'react';
import type { Position } from '~/types';
import {
  borderRadiusDropdown,
  colorBackgroundDropdownItemDefault,
  colorBorderControlDefault,
  colorTextBodyDefault,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';

export type MenuProps = {
  position: Position & { z?: number };
  clickOutside?: (event: PointerEvent) => void;
  children: ReactNode;
};

const Menu: React.FC<MenuProps> = ({ position, clickOutside, children }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );

  const popperElement = useClickOutside<HTMLDivElement>(
    (e) => clickOutside && clickOutside(e)
  );

  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement.current,
    {
      placement: 'right-start',
      modifiers: [
        flip,
        preventOverflow,
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  return (
    <>
      <div
        className='iot-context-menu-placement'
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        ref={setReferenceElement}
      />

      <div
        className='iot-context-menu'
        ref={popperElement}
        style={{
          ...styles.popper,
          zIndex: position.z,
          border: `${spaceScaledXxxs} solid ${colorBorderControlDefault}`,
          minWidth: '192px', // 128+64, just picking a width which is a multiple of 8
          borderRadius: borderRadiusDropdown,
          background: colorBackgroundDropdownItemDefault,
          color: colorTextBodyDefault,
        }}
        {...attributes.popper}
        onPointerDown={(e) => e.stopPropagation()} // prevent the grid from handling click events
        onPointerUp={(e) => e.stopPropagation()} // prevent the grid from handling click events}
      >
        {children}
      </div>
    </>
  );
};

export default Menu;
