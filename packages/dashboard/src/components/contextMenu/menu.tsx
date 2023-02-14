import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';

import { Position } from '../../types';

import './menu.css';
import { useClickOutside } from '../../hooks/useClickOutside';

export type MenuProps = {
  position: Position;
  clickOutside?: (event: PointerEvent) => void;
};

const Menu: React.FC<MenuProps> = ({ position, clickOutside, children }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

  const popperElement = useClickOutside<HTMLDivElement>((e) => clickOutside && clickOutside(e));

  const { styles, attributes } = usePopper(referenceElement, popperElement.current, {
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
  });

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
        style={styles.popper}
        {...attributes.popper}
        onPointerDown={(e) => {
          e.stopPropagation();
          // prevent the grid from handling click events
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          // prevent the grid from handling click events
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Menu;
