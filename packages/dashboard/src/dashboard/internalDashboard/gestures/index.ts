import { useState } from 'react';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import type {
  DragEvent,
  PointClickEvent,
} from '../../../features/dashboard-canvas';
import { useSelectionTool } from '../../../features/widget-selection/use-selection-tool';
import { determineTargetGestures } from './determineTargetGestures';
import type { Gesture } from './types';
import { useMoveGestures } from './useMove';
import { useResizeGestures } from './useResize';

export const useGestures = () => {
  const selectedWidgetIds = useSelectedWidgetIds();
  const [activeGesture, setActiveGesture] = useState<Gesture | undefined>(
    undefined
  );

  const {
    userSelection,
    onPointSelect,
    onSelectionStart,
    onSelectionUpdate,
    onSelectionEnd,
  } = useSelectionTool({
    setActiveGesture,
  });
  const { onMoveStart, onMoveUpdate, onMoveEnd } = useMoveGestures({
    setActiveGesture,
  });
  const { onResizeStart, onResizeUpdate, onResizeEnd } = useResizeGestures({
    setActiveGesture,
  });

  const onPointClick = (pointClickEvent: PointClickEvent) => {
    onPointSelect(pointClickEvent);
  };
  const onGestureStart = (dragEvent: DragEvent) => {
    /**
     * Note: isOnSelection refers to the cursor being in a location which is over the selection rect but not
     * over a selected widget. To understand if we are on a widget in the selection we must use the widget id
     */
    const {
      isOnResizeHandle,
      isOnSelection,
      isOnWidget,
      widgetId,
      isUnion,
      anchor,
    } = determineTargetGestures(dragEvent);

    const isOnWidgetInSelection = selectedWidgetIds.some(
      (id) => id === widgetId
    );

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
