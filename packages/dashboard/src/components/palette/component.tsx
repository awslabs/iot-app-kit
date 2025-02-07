import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../dragLayer/itemTypes';
import { PaletteComponentIcon } from './icons';
import type { ComponentPaletteDraggable } from './types';
import { type SVGIcon } from '~/features/widget-plugins/plugin';
import './component.css';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export interface PaletteComponentProps<
  WidgetType extends RegisteredWidgetType
> {
  widgetName: string;
  componentTag: WidgetType;
  icon: { light: SVGIcon; dark: SVGIcon };
  onAddWidget: (componentTag: WidgetType) => void;
}

export const PaletteComponent = <WidgetType extends RegisteredWidgetType>({
  componentTag,
  widgetName,
  icon,
  onAddWidget,
}: PaletteComponentProps<WidgetType>) => {
  const node = useRef(null);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.Component,
      item: (): ComponentPaletteDraggable<WidgetType> => {
        return {
          widgetType: componentTag,
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
        aria-label={`add ${widgetName} widget`}
        className='palette-button'
        ref={dragRef}
        draggable='true'
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        <PaletteComponentIcon widgetName={widgetName} icon={icon} />
      </button>
    </li>
  );
};
