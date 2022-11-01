import React, { PointerEventHandler, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useKeyPress } from '../../hooks/useKeyPress';
import { DashboardState } from '../../store/state';
import { Position } from '../../types';
import { gestureable } from '../internalDashboard/determineTargetGestures';
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

export type GridProps = {
  grid: DashboardState['grid'];
  click: (e: PointClickEvent) => void;
  dragStart: (e: DragEvent) => void;
  drag: (e: DragEvent) => void;
  dragEnd: (e: DragEvent) => void;
};

const defaultDelta = { x: 0, y: 0 };

const Grid: React.FC<GridProps> = ({ grid, click, dragStart, drag, dragEnd, children }) => {
  const { width, height, cellSize, stretchToFit } = grid;

  const [delta, setDelta] = useState<Position>(defaultDelta);
  const [cancelClick, setCancelClick] = useState(false);
  const [start, setStart] = useState<Position>(defaultDelta);
  const [end, setEnd] = useState<Position>(defaultDelta);
  const [target, setTarget] = useState<EventTarget | undefined>();
  const union = useKeyPress((e) => e.shiftKey);

  const [collected, ref] = useDrag(
    () => ({
      type: 'grid',
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
    }),
    [union, start, end]
  );

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
    if (!cancelClick) {
      click({
        position: getDashboardPosition(e),
        union,
      });
    }
  };

  return (
    <div {...gestureable('grid')} ref={ref} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <div
        id={DASHBOARD_CONTAINER_ID}
        tabIndex={0}
        className="container"
        style={{
          width: stretchToFit ? '100%' : `${(width + 1) * cellSize}px`,
          height: stretchToFit ? '100%' : `${(height + 1) * cellSize}px`,
          backgroundSize: `${cellSize}px`,
        }}
      >
        <div className="grid-image" style={{ backgroundSize: `${cellSize}px` }} />
        {children}
      </div>
    </div>
  );
};

export default Grid;
