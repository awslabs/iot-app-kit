import {
  borderRadiusDropdown,
  colorBackgroundDropdownItemDefault,
  colorBorderControlDefault,
  colorTextBodyDefault,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import flip from '@popperjs/core/lib/modifiers/flip';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { useClickOutside } from '../../hooks/useClickOutside';
import type { 2DPosition } from '../../types';
import './menu.css';

export type MenuProps = {
  position: 2DPosition & { z?: number };
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
