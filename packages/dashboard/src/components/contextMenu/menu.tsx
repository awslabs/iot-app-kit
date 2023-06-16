import {
  borderRadiusDropdown,
  colorBackgroundDropdownItemDefault,
  colorBorderControlDefault,
  spaceScaledXxxs,
} from '@cloudscape-design/design-tokens';
import flip from '@popperjs/core/lib/modifiers/flip.js';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import React, { useRef, useState, type ReactNode } from 'react';
import { usePopper } from 'react-popper';
import useClickAway from 'react-use/lib/useClickAway';

import type { Position } from '~/types';

import './menu.css';

export interface MenuProps {
  position: Position & { z?: number };
  clickOutside?: (event: PointerEvent) => void;
  children: ReactNode;
}

export function Menu({ position, clickOutside, children }: MenuProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const popperElement = useRef(null);

  useClickAway(popperElement, (event) => clickOutside && clickOutside(event as PointerEvent));

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
        style={{
          ...styles.popper,
          zIndex: position.z,
          border: `${spaceScaledXxxs} solid ${colorBorderControlDefault}`,
          minWidth: '192px', // 128+64, just picking a width which is a multiple of 8
          borderRadius: borderRadiusDropdown,
          background: colorBackgroundDropdownItemDefault,
        }}
        {...attributes.popper}
        onPointerDown={(e) => e.stopPropagation()} // prevent the grid from handling click events
        onPointerUp={(e) => e.stopPropagation()} // prevent the grid from handling click events}
      >
        {children}
      </div>
    </>
  );
}
