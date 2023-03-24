import type { PointerEventHandler, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useKeyPress } from '~/hooks/useKeyPress';
import type { Position } from '~/types';
import { MouseClick } from '~/types';
import { ItemTypes } from '../dragLayer/itemTypes';
import { gestureable } from '../internalDashboard/gestures/determineTargetGestures';
import { DASHBOARD_CONTAINER_ID, getDashboardPosition } from './getDashboardPosition';
import './index.css';
import type { DashboardState } from '~/store/state';
import type { ComponentPaletteDraggable } from '../palette/types';

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
    componentTag: string;
  };
};

export type GridProps = {
  children: ReactNode;
  readOnly: boolean;
  grid: DashboardState['grid'];
  click: (e: PointClickEvent) => void;
  dragStart: (e: DragEvent) => void;
  drag: (e: DragEvent) => void;
  dragEnd: (e: DragEvent) => void;
  drop: (e: DropEvent) => void;
};

const trackPosition = (defaultPosition: Position) => {
  let position = defaultPosition;

  return {
    getPosition: () => position,
    setPosition: (newPosition: Position) => {
      position = newPosition;
    },
  };
};

const defaultDelta = { x: 0, y: 0 };

const deltaTracker = trackPosition(defaultDelta);
const startTracker = trackPosition(defaultDelta);
const endTracker = trackPosition(defaultDelta);

const constrainPosition = (params: {
  position: Position;
  gridSize: { width: number; height: number; x: number; y: number };
}) => {
  const { position, gridSize } = params;
  return {
    x: Math.min(Math.max(position.x, 0), gridSize.width),
    y: Math.min(Math.max(position.y, 0), gridSize.height),
  };
};

const Grid: React.FC<GridProps> = ({ readOnly, grid, click, dragStart, drag, dragEnd, drop, children }) => {
  const { width, height, cellSize, stretchToFit, enabled } = grid;

  const [dashboardGrid, setDashboardGrid] = useState<DOMRect | null>(null);
  const [cancelClick, setCancelClick] = useState(false);
  const [target, setTarget] = useState<EventTarget | undefined>();
  const union = useKeyPress('shift');

  const [collected, dragRef] = useDrag(
    () => ({
      type: ItemTypes.Grid,
      item: (monitor) => {
        setCancelClick(true);
        dragStart({
          target,
          start: startTracker.getPosition(),
          end: endTracker.getPosition(),
          vector: defaultDelta,
          union,
        });
        deltaTracker.setPosition(monitor.getClientOffset() || defaultDelta);
        return {};
      },
      end: () => {
        setCancelClick(false);
        dragEnd({
          target,
          start: startTracker.getPosition(),
          end: endTracker.getPosition(),
          vector: defaultDelta,
          union,
        });
        deltaTracker.setPosition(defaultDelta);
      },
      collect: (monitor) => {
        return {
          monitor,
          type: monitor.getItemType(),
          isDragging: !!monitor.isDragging(),
          clientOffset: monitor.getClientOffset(),
        };
      },
      canDrag: !readOnly && enabled,
    }),
    [union, startTracker.getPosition(), endTracker.getPosition()]
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
      if (!dashboardGrid) return;
      const constrainedOffset = constrainPosition({
        position: {
          x: clientOffset.x - dashboardGrid.x,
          y: clientOffset.y - dashboardGrid.y,
        },
        gridSize: dashboardGrid,
      });

      const constrainedDeltaTracker = constrainPosition({
        position: {
          x: deltaTracker.getPosition().x - dashboardGrid.x,
          y: deltaTracker.getPosition().y - dashboardGrid.y,
        },
        gridSize: dashboardGrid,
      });
      const offset = {
        x: constrainedOffset.x - constrainedDeltaTracker.x,
        y: constrainedOffset.y - constrainedDeltaTracker.y,
      };

      const updatedEndPosition = {
        x: endTracker.getPosition().x + offset.x,
        y: endTracker.getPosition().y + offset.y,
      };

      drag({
        target,
        start: startTracker.getPosition(),
        end: updatedEndPosition,
        vector: offset,
        union,
      });
      endTracker.setPosition(updatedEndPosition);
      deltaTracker.setPosition(clientOffset);
      setCancelClick(true);
    }
  }, [collected.isDragging, collected.clientOffset]);

  const onPointerDown: PointerEventHandler = (e) => {
    if (readOnly) return;
    setTarget(e.target);
    setCancelClick(false);
    const dashboardGrid = document.getElementById(DASHBOARD_CONTAINER_ID)?.getBoundingClientRect();
    if (dashboardGrid) {
      setDashboardGrid(dashboardGrid);
    }
    startTracker.setPosition(getDashboardPosition(e));
    endTracker.setPosition(getDashboardPosition(e));
  };

  const onPointerUp: PointerEventHandler = (e) => {
    if (cancelClick || !enabled || readOnly) return;

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
            className='grid-image'
            style={{
              backgroundSize: `${cellSize}px ${cellSize}px`,
              right: `${cellSize * 0.5}px`,
              top: `-${cellSize * 0.5}px`,
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Grid;
