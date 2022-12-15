import React, { PointerEventHandler, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useKeyPress } from '../../hooks/useKeyPress';
import { DashboardState } from '../../store/state';
import { ComponentTag, MouseClick, Position } from '../../types';
import { ItemTypes } from '../dragLayer/itemTypes';
import { gestureable } from '../internalDashboard/determineTargetGestures';
import { ComponentPaletteDraggable } from '../palette/types';
import { DASHBOARD_CONTAINER_ID, getDashboardPosition } from './getDashboardPosition';

import './index.css';

export type DragEvent = {
  target?: EventTarget;
  start: Position;
  end: Position;
  vector: Position;
  union: boolean;
};
export type PointClickEvent = {
  target?: EventTarget;
  position: Position;
  union: boolean;
};

export type DropEvent = {
  position: Position;
  item: {
    componentTag: ComponentTag;
  };
};

export type GridProps = {
  grid: DashboardState['grid'];
  click: (e: PointClickEvent) => void;
  dragStart: (e: DragEvent) => void;
  drag: (e: DragEvent) => void;
  dragEnd: (e: DragEvent) => void;
  drop: (e: DropEvent) => void;
};

const defaultDelta = { x: 0, y: 0 };

const Grid: React.FC<GridProps> = ({ grid, click, dragStart, drag, dragEnd, drop, children }) => {
  const { width, height, cellSize, stretchToFit, enabled } = grid;

  const [delta, setDelta] = useState<Position>(defaultDelta);
  const [cancelClick, setCancelClick] = useState(false);
  const [start, setStart] = useState<Position>(defaultDelta);
  const [end, setEnd] = useState<Position>(defaultDelta);
  const [target, setTarget] = useState<EventTarget | undefined>();
  const union = useKeyPress('shift');

  const [collected, dragRef] = useDrag(
    () => ({
      type: ItemTypes.Grid,
      item: (monitor) => {
        setCancelClick(true);
        dragStart({
          target,
          start,
          end,
          vector: defaultDelta,
          union,
        });
        setDelta(monitor.getClientOffset() || defaultDelta);
        return {};
      },
      end: () => {
        setCancelClick(false);
        dragEnd({
          target,
          start,
          end,
          vector: defaultDelta,
          union,
        });
        setDelta(defaultDelta);
      },
      collect: (monitor) => {
        return {
          monitor,
          type: monitor.getItemType(),
          isDragging: !!monitor.isDragging(),
          clientOffset: monitor.getClientOffset(),
        };
      },
      canDrag: enabled,
    }),
    [union, start, end]
  );

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: [ItemTypes.Component],
    drop: (item: ComponentPaletteDraggable, monitor) => {
      const initialClientOffset = monitor.getInitialClientOffset(); // where the cursor was in the viewport when the drag started;
      const clientOffset = monitor.getClientOffset(); // where cursor is in the viewport when drop occurs;
      const gridRect = document.getElementById(DASHBOARD_CONTAINER_ID)?.getBoundingClientRect();
      const itemRect = item.rect;

      if (!initialClientOffset || !clientOffset || !gridRect || !itemRect) return;

      // find cursor position in the grid
      const gridOffset = {
        x: clientOffset.x - gridRect.x,
        y: clientOffset.y - gridRect.y,
      };
      // find cursor position in the drag item
      const draggableOffset = {
        x: initialClientOffset.x - itemRect.x,
        y: initialClientOffset.y - itemRect.y,
      };
      // find top left corner of the drag item in the grid
      const position = {
        x: gridOffset.x - draggableOffset.x,
        y: gridOffset.y - draggableOffset.y,
      };

      drop({
        item,
        position,
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    const { isDragging, clientOffset } = collected;

    if (isDragging && clientOffset) {
      const offset = {
        x: clientOffset.x - delta.x,
        y: clientOffset.y - delta.y,
      };
      const updatedEndPosition = {
        x: end.x + offset.x,
        y: end.y + offset.y,
      };
      drag({
        target,
        start,
        end: updatedEndPosition,
        vector: offset,
        union,
      });
      setEnd(updatedEndPosition);
      setDelta(clientOffset);
      setCancelClick(true);
    }
  }, [collected.isDragging, collected.clientOffset]);

  const onPointerDown: PointerEventHandler = (e) => {
    setTarget(e.target);
    setCancelClick(false);
    setStart(getDashboardPosition(e));
    setEnd(getDashboardPosition(e));
  };

  const onPointerUp: PointerEventHandler = (e) => {
    if (cancelClick || !enabled) return;

    if (e.button === MouseClick.Left) {
      click({
        position: getDashboardPosition(e),
        union,
      });
    }
  };

  return (
    <div {...gestureable('grid')} ref={dragRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <div ref={dropRef}>
        <div
          id={DASHBOARD_CONTAINER_ID}
          tabIndex={0}
          className={`container ${isOver ? 'grid-container-border-highlighted' : ''}`}
          style={{
            width: stretchToFit ? '100%' : `${(width + 1) * cellSize}px`,
            height: stretchToFit ? '100%' : `${(height + 1) * cellSize}px`,
          }}
        >
          <div
            className="grid-image"
            style={{
              backgroundSize: `${cellSize}px ${cellSize}px`,
              right: `${cellSize * 0.05}px`,
              top: `-${cellSize * 0.05}px`,
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Grid;
