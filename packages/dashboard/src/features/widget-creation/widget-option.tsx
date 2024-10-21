import React, {
  memo,
  type PropsWithChildren,
  useCallback,
  useRef,
} from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { ItemTypes } from '~/features/widget-movement/itemTypes';
import { useCreateWidgets } from '~/store/dashboard/use-create-widgets';

export interface WidgetOptionProps extends PropsWithChildren {
  title: string;
  widgetType: string;
}

export const WidgetOption = memo(function ({
  title,
  widgetType,
  children,
}: WidgetOptionProps) {
  const createWidgets = useCreateWidgets();
  const node = useRef(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.Component,
      item: () => ({
        componentTag: widgetType,
        rect: node.current
          ? (node.current as Element).getBoundingClientRect()
          : null, // Used to determine the cursor offset from the upper left corner on drop
      }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  const handleAddWidget = useCallback(() => {
    if (!isDragging) {
      createWidgets([{ type: widgetType }]);
    }
  }, [isDragging, createWidgets, widgetType]);

  // Must handle key down specifically for enter or space
  // because we are using pointer up instead of click
  // https://accessibleweb.com/question-answer/what-keyboard-functions-need-to-be-compatible-with-a-button/
  const handleKeyDown = useCallback(
    ({ key }: React.KeyboardEvent) => {
      if (key === 'Enter' || key === 'Space') {
        createWidgets([{ type: widgetType }]);
      }
    },
    [createWidgets, widgetType]
  );

  return (
    <WidgetListItem ref={node}>
      <WidgetButton
        draggable
        title={title}
        ref={drag}
        onClick={handleAddWidget}
        onKeyDown={handleKeyDown}
      >
        {children}
      </WidgetButton>
    </WidgetListItem>
  );
});

const WidgetListItem = styled.li`
  margin-right: 8px;
`;

const WidgetButton = styled.button`
  width: 36px;
  height: 36px;
  border: 2px solid black;
  border-radius: 5px;
  padding: 0;
  background-color: white;
  color: #424650;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: grab;
    background-color: #424650;
    color: white;
  }
`;
