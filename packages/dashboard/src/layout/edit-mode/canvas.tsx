import type { PropsWithChildren } from 'react';
import { Canvas, CanvasScrollContainer } from '~/features/dashboardCanvas';
import { gestureable } from '~/features/gestures/determineTargetGestures';
import { toGridPosition } from '~/features/gestures/position';
import type { DropEvent } from '~/features/gestures/types';
import { useGestures } from '~/features/gestures/useGestures';
import { useGridDragAndDrop } from '~/features/gestures/useGridDragAndDrop';
import { widgetFactory } from '#features/widget-creation/factory';
import { useCreateWidgets } from '~/store/dashboard/useCreateWidgets';
import { useDashboardCellSize } from '~/store/dashboard/useDashboardCellSize';
import { useDashboardHeight } from '~/store/dashboard/useDashboardHeight';
import { useDashboardWidth } from '~/store/dashboard/useDashboardWidth';
import type { DashboardWidget, 2DPosition } from '#types';

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
    position: 2DPosition;
  }) => {
    const widgetPresets = widgetFactory({
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
