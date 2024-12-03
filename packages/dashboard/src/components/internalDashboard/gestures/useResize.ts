import type * as React from 'react';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { Anchor } from '../../../store/actions';
import { onResizeWidgetsAction } from '../../../store/actions';
import type { DashboardState } from '../../../store/state';
import type { DashboardWidget, Position } from '../../../types';
import { toGridPosition } from '../../../util/position';
import type { DragEvent } from '../../grid';
import type { Gesture } from './types';

type ResizeHooksProps = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  selectedWidgets: DashboardWidget[];
  cellSize: DashboardState['grid']['cellSize'];
};

export const useResizeGestures = ({
  setActiveGesture,
  selectedWidgets,
  cellSize,
}: ResizeHooksProps) => {
  const dispatch = useDispatch();

  const resizeWidgets = useCallback(
    (anchor: Anchor, vector: Position, complete?: boolean) => {
      dispatch(
        onResizeWidgetsAction({
          anchor,
          widgets: selectedWidgets,
          vector: toGridPosition(vector, cellSize),
          complete,
        })
      );
    },
    [selectedWidgets, cellSize, dispatch]
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
