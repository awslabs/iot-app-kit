import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypes } from '../dragLayer/itemTypes';
import PaletteComponentIcon from './icons';

import type { ComponentPaletteDraggable } from './types';

import './component.css';

type PaletteComponentProps = {
  name: string;
  componentTag: string;
  IconComponent: React.FC;
  onAddWidget: (componentTag: string) => void;
};

const PaletteComponent: React.FC<PaletteComponentProps> = ({
  componentTag,
  name,
  IconComponent,
  onAddWidget,
}) => {
  const node = useRef(null);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.Component,
      item: (): ComponentPaletteDraggable => {
        return {
          componentTag,
          rect: node.current
            ? (node.current as Element).getBoundingClientRect()
            : null, // Used to determine the cursor offset from the upper left corner on drop
        };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  // isDragging updates before the click event is captured and the handler executes
  // the pointer up event fires before the hook value updates.
  // this because it's what ReactDnD uses to indicate drag start / drag end
  const handleClick = () => {
    if (isDragging) return;
    onAddWidget(componentTag);
  };

  // Must handle key down specifically for enter or space
  // because we are using pointer up instead of click
  // https://accessibleweb.com/question-answer/what-keyboard-functions-need-to-be-compatible-with-a-button/
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!['enter', 'space'].includes(e.code.toLowerCase())) return;
    onAddWidget(componentTag);
  };

  return (
    <li ref={node}>
      <button
        aria-label={`add ${name} widget`}
        className='palette-button'
        ref={dragRef}
        draggable='true'
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        <PaletteComponentIcon widgetName={name} Icon={IconComponent} />
      </button>
    </li>
  );
};

export default PaletteComponent;
