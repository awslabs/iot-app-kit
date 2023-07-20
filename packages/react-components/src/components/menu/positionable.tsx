import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';
import type { Options } from '@popperjs/core/lib/types';
import type { PropsWithChildren, RefCallback } from 'react';

import { Menu, MenuProps } from './menu';

import './menu.css';

type Position = { x: number; y: number; z?: number };
type ReferenceElement = (setRef: RefCallback<null>) => React.ReactNode;

type AbsoluteMenu = {
  position: Position;
  referenceElement?: never;
};
type RelativeMenu = {
  position?: never;
  referenceElement: ReferenceElement;
};

export type PositionableMenuProps = {
  offset?: [number, number];
  placement?: Options['placement'];
  open: boolean;
} & MenuProps &
  (AbsoluteMenu | RelativeMenu);

const createReferenceElement = (setRef: RefCallback<Element | null>, position: Position) => {
  return (
    <div
      className='menu-placement'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      ref={setRef}
    />
  );
};

/**
 * Wrapper component for <Menu />
 * The wrapper allows you to define visibility via the open prop
 * and also position the menu relatively against another html element
 * or absolutely by a position.
 */
export const PositionableMenu: React.FC<PropsWithChildren<PositionableMenuProps>> = ({
  position,
  referenceElement,
  open,
  placement,
  offset = [0, 10],
  ...options
}) => {
  const [placementRef, setPlacementRef] = useState<Element | null>(null);
  const [popperRef, setPopperRef] = useState<HTMLElement | null>(null);

  const { styles, attributes, update } = usePopper(placementRef, popperRef, {
    placement: placement ?? (position ? 'right-start' : 'bottom-start'),
    modifiers: [
      flip,
      preventOverflow,
      {
        name: 'offset',
        options: {
          offset,
        },
      },
    ],
  });

  useEffect(() => {
    // ensure that popper's position is synced to the reference position.
    update && update();
  }, [position]);

  return (
    <>
      {position ? createReferenceElement(setPlacementRef, position) : referenceElement(setPlacementRef)}

      <div
        ref={setPopperRef}
        style={{
          ...styles.popper,
        }}
        {...attributes.popper}
      >
        {open && <Menu {...options} />}
      </div>
    </>
  );
};
