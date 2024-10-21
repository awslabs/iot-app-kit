import type { PropsWithChildren } from 'react';
import React from 'react';
import { useGestures } from '~/dashboard/internalDashboard/gestures';
import { gestureable } from '~/dashboard/internalDashboard/gestures/determineTargetGestures';
import { Canvas, CanvasScrollContainer } from '~/features/dashboard-canvas';
import type { DropEvent } from '~/features/dashboard-canvas/gestures/types';
import { useGridDragAndDrop } from '~/features/dashboard-canvas/gestures/useGridDragAndDrop';
import { toGridPosition } from '~/helpers/position';
import { widgetCreator } from '~/store/dashboard/factory';
import { useCreateWidgets } from '~/store/dashboard/use-create-widgets';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useDashboardHeight } from '~/store/dashboard/use-dashboard-height';
import { useDashboardWidth } from '~/store/dashboard/use-dashboard-width';
import { DashboardWidget, Position } from '~/types';

export interface EditModeCanvasProps extends PropsWithChildren {
  enabled: boolean;
}

/**
 *
 * A dashboard grid that has listners setup to handle
 * drag and drop / click gesture interactions
 *
 */
export function EditModeCanvas({ enabled, children }: EditModeCanvasProps) {
  const createWidgets = useCreateWidgets();
  const [dashboardHeight] = useDashboardHeight();
  const [dashboardWidth] = useDashboardWidth();
  const [cellSize] = useDashboardCellSize();

  const { onPointClick, onGestureStart, onGestureUpdate, onGestureEnd } =
    useGestures();

  const onAddWidget = ({
    componentTag,
    position,
  }: {
    componentTag: string;
    position: Position;
  }) => {
    const widgetPresets = widgetCreator({
      height: dashboardHeight,
      width: dashboardWidth,
      cellSize: cellSize,
    })(componentTag);

    const { x, y } = toGridPosition(position, cellSize);

    const widget: DashboardWidget = {
      ...widgetPresets,
      x: Math.floor(x),
      y: Math.floor(y),
      z: 0,
    };

    createWidgets([widget]);
  };

  const onDrop = (e: DropEvent) => {
    const { item, position } = e;
    const componentTag = item.componentTag;

    onAddWidget({ componentTag, position });
  };

  const { dragRef, dropRef, isOver, onPointerDown, onPointerUp } =
    useGridDragAndDrop({
      enabled,
      readOnly: false,
      click: onPointClick,
      drag: onGestureUpdate,
      dragStart: onGestureStart,
      dragEnd: onGestureEnd,
      drop: onDrop,
    });

  return (
    <div
      {...gestureable('grid')}
      ref={dragRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{ height: '100%' }}
    >
      <CanvasScrollContainer ref={dropRef}>
        <Canvas showGrid showGuides highlighted={isOver}>
          {children}
        </Canvas>
      </CanvasScrollContainer>
    </div>
  );
}
