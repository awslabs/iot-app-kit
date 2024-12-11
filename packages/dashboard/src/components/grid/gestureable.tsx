import type { PropsWithChildren } from 'react';
import type { DashboardState } from '../../store/state-old';
import { gestureable } from '../internalDashboard/gestures/determineTargetGestures';
import {
  type DragEvent,
  type DropEvent,
  type PointClickEvent,
} from './gestures/types';
import { useGridDragAndDrop } from './gestures/useGridDragAndDrop';
import { SizedGrid } from './sizedGrid';

export type GesturableGridProps = PropsWithChildren<{
  readOnly: boolean;
  grid: DashboardState['grid'];
  click: (e: PointClickEvent) => void;
  dragStart: (e: DragEvent) => void;
  drag: (e: DragEvent) => void;
  dragEnd: (e: DragEvent) => void;
  drop: (e: DropEvent) => void;
}>;

/**
 *
 * A dashboard grid that has listners setup to handle
 * drag and drop / click gesture interactions
 *
 */
export const GestureableGrid: React.FC<GesturableGridProps> = ({
  readOnly,
  grid,
  click,
  dragStart,
  drag,
  dragEnd,
  drop,
  children,
}) => {
  const { width, height, cellSize, enabled } = grid;

  const { dragRef, dropRef, isOver, onPointerDown, onPointerUp } =
    useGridDragAndDrop({
      readOnly,
      enabled,
      click,
      drag,
      dragStart,
      dragEnd,
      drop,
    });

  return (
    <div
      {...gestureable('grid')}
      ref={dragRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div ref={dropRef}>
        <SizedGrid
          width={width}
          height={height}
          cellSize={cellSize}
          showGuides={!readOnly}
          highlighted={isOver}
          children={children}
        />
      </div>
    </div>
  );
};
