import type * as React from 'react';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { Anchor } from '~/store/actions';
import { onResizeWidgetsAction } from '~/store/actions';
import { toGridPosition } from '~/util/position';
import type { DashboardState } from '~/store/state';
import type { Position } from '~/types';
import type { DragEvent } from '../../grid';
import type { Gesture } from './types';

export interface UseResizeGesturesOptions {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  selectedWidgetIds: readonly string[];
  cellSize: DashboardState['grid']['cellSize'];
}

export const useResizeGestures = ({
  setActiveGesture,
  selectedWidgetIds,
  cellSize,
}: UseResizeGesturesOptions) => {
  const dispatch = useDispatch();

  const resizeWidgets = useCallback(
    (anchor: Anchor, vector: Position, complete?: boolean) => {
      dispatch(
        onResizeWidgetsAction({
          anchor,
          widgetIds: selectedWidgetIds,
          vector: toGridPosition(vector, cellSize),
          complete,
        })
      );
    },
    [selectedWidgetIds, cellSize, dispatch]
  );

  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const onResizeStart = (anchor: Anchor | null) => {
    setAnchor(anchor);
    setActiveGesture('resize');
  };
  const onResizeUpdate = (dragEvent: DragEvent) => {
    if (!anchor) return;
    resizeWidgets(anchor, dragEvent.vector, false);
  };
  const onResizeEnd = (dragEvent: DragEvent) => {
    if (!anchor) return;
    resizeWidgets(anchor, dragEvent.vector, true);
    setAnchor(null);
  };

  return {
    onResizeStart,
    onResizeUpdate,
    onResizeEnd,
  };
};
