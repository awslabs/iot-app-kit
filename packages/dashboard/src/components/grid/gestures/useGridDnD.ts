import { useKeyPress } from '~/hooks/useKeyPress';
import { type DragEvent, type DropEvent, type PointClickEvent } from './types';
import { usePointerTracker } from './usePointerTracker';
import { useDragMonitor } from './useDragMonitor';
import { useDropMonitor } from './useDropMonitor';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';

export interface UseGridDnDOptions<WidgetType extends RegisteredWidgetType> {
  readOnly: boolean;
  enabled: boolean;
  click: (e: PointClickEvent) => void;
  dragStart: (e: DragEvent) => void;
  dragEnd: (e: DragEvent) => void;
  drag: (e: DragEvent) => void;
  drop: (e: DropEvent<WidgetType>) => void;
}

/**
 * Handles triggering drag and drop gestures with the correct target and positions
 */
export const useGridDnD = <WidgetType extends RegisteredWidgetType>({
  readOnly,
  enabled,
  click,
  drag,
  dragEnd,
  dragStart,
  drop,
}: UseGridDnDOptions<WidgetType>) => {
  const union = useKeyPress('shift');

  const { target, dashboardGrid, setCancelClick, onPointerDown, onPointerUp } =
    usePointerTracker({
      readOnly,
      enabled,
      union,
      click,
    });

  const { dragRef } = useDragMonitor({
    readOnly,
    enabled: enabled && !union,
    union,
    target,
    dashboardGrid,
    setCancelClick,
    drag,
    dragStart,
    dragEnd,
  });

  const { isOver, dropRef } = useDropMonitor({ drop });

  return {
    onPointerDown,
    onPointerUp,
    dragRef,
    dropRef,
    isOver,
  };
};
