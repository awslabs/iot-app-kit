import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';

import { Position } from '../../types';

import './menu.css';

export type MenuProps = {
  position: Position;
  clickOutside?: (event: MouseEvent) => void;
};

const Menu: React.FC<MenuProps> = ({ position, clickOutside, children }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
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

  useEffect(() => {
    if (!clickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popperElement && event.target && event.target instanceof Node && !popperElement.contains(event.target)) {
        clickOutside(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popperElement]);

  return (
    <>
      <div
        className="iot-context-menu-placement"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        ref={setReferenceElement}
      />

      <div
        className="iot-context-menu"
        ref={setPopperElement}
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
