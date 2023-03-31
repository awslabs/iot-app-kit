import { useState } from 'react';
import { determineTargetGestures } from './determineTargetGestures';
import { useMoveGestures } from './useMove';
import { useResizeGestures } from './useResize';
import { useSelectionGestures } from './useSelection';
import type { DashboardState } from '~/store/state';
import type { DashboardWidget } from '~/types';
import type { DragEvent, PointClickEvent } from '../../grid';
import type { Gesture } from './types';

type GestureHooksProps = {
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  selectedWidgets: DashboardWidget[];
  cellSize: DashboardState['grid']['cellSize'];
};

export const useGestures = ({ dashboardConfiguration, selectedWidgets, cellSize }: GestureHooksProps) => {
  const [activeGesture, setActiveGesture] = useState<Gesture | undefined>(undefined);

  const { userSelection, onPointSelect, onSelectionStart, onSelectionUpdate, onSelectionEnd } = useSelectionGestures({
    setActiveGesture,
    dashboardConfiguration,
    cellSize: cellSize,
  });
  const { onMoveStart, onMoveUpdate, onMoveEnd } = useMoveGestures({
    setActiveGesture,
    selectedWidgets,
    cellSize: cellSize,
  });
  const { onResizeStart, onResizeUpdate, onResizeEnd } = useResizeGestures({
    setActiveGesture,
    selectedWidgets,
    cellSize: cellSize,
  });

  const onPointClick = (pointClickEvent: PointClickEvent) => {
    onPointSelect(pointClickEvent);
  };
  const onGestureStart = (dragEvent: DragEvent) => {
    /**
     * Note: isOnSelection refers to the cursor being in a location which is over the selection rect but not
     * over a selected widget. To understand if we are on a widget in the selection we must use the widget id
     */
    const { isOnResizeHandle, isOnSelection, isOnWidget, widgetId, isUnion, anchor } =
      determineTargetGestures(dragEvent);

    const isOnWidgetInSelection = selectedWidgets.some((widget) => widget.id === widgetId);

    const isMoveGesture = !isUnion && (isOnWidget || isOnSelection);

    if (isOnWidget && !isOnSelection && !isOnWidgetInSelection) {
      onPointSelect({ position: dragEvent.start, union: dragEvent.union });
    }

    if (isOnResizeHandle) {
      onResizeStart(anchor);
    } else if (isMoveGesture) {
      onMoveStart();
    } else {
      onSelectionStart(dragEvent);
    }
  };
  const onGestureUpdate = (dragEvent: DragEvent) => {
    if (activeGesture === 'resize') {
      onResizeUpdate(dragEvent);
    } else if (activeGesture === 'select') {
      onSelectionUpdate(dragEvent);
    } else if (activeGesture === 'move') {
      onMoveUpdate(dragEvent);
    }
  };
  const onGestureEnd = (dragEvent: DragEvent) => {
    if (activeGesture === 'resize') {
      onResizeEnd(dragEvent);
    } else if (activeGesture === 'select') {
      onSelectionEnd();
    } else if (activeGesture === 'move') {
      onMoveEnd(dragEvent);
    }

    setActiveGesture(undefined);
  };

  return {
    activeGesture,
    userSelection,
    onPointClick,
    onGestureStart,
    onGestureUpdate,
    onGestureEnd,
  };
};
