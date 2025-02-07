import type { PropsWithChildren } from 'react';
import type { DashboardState } from '~/store/state';
import { gestureable } from '../internalDashboard/gestures/determineTargetGestures';
import {
  type DragEvent,
  type DropEvent,
  type PointClickEvent,
} from './gestures/types';
import { useGridDnD } from './gestures/useGridDnD';
import { SizedGrid } from './sizedGrid';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export interface GesturableGridProps<WidgetType extends RegisteredWidgetType>
  extends PropsWithChildren {
  readOnly: boolean;
  grid: DashboardState['grid'];
  click: (e: PointClickEvent) => void;
  dragStart: (e: DragEvent) => void;
  drag: (e: DragEvent) => void;
  dragEnd: (e: DragEvent) => void;
  drop: (e: DropEvent<WidgetType>) => void;
}

/**
 * A dashboard grid that has listners setup to handle
 * drag and drop / click gesture interactions
 */
export const GestureableGrid = <WidgetType extends RegisteredWidgetType>({
  readOnly,
  grid,
  click,
  dragStart,
  drag,
  dragEnd,
  drop,
  children,
}: GesturableGridProps<WidgetType>) => {
  const { width, height, cellSize, enabled } = grid;

  const { dragRef, dropRef, isOver, onPointerDown, onPointerUp } = useGridDnD({
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
