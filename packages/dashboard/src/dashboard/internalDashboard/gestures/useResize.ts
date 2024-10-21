import React, { useCallback, useState } from 'react';
import type { DragEvent } from '~/features/dashboard-canvas';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import { toGridPosition } from '~/helpers/position';
import type { Anchor } from '~/store/dashboard/reducer';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useResizeWidgets } from '~/store/dashboard/use-resize-widgets';
import type { Position } from '~/types';
import type { Gesture } from './types';

type ResizeHooksProps = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
};

export const useResizeGestures = ({ setActiveGesture }: ResizeHooksProps) => {
  const selectedWidgets = useSelectedWidgets();
  const [cellSize] = useDashboardCellSize();
  const resizeWidgets = useResizeWidgets();

  const handleResizeWidgets = useCallback(
    (anchor: Anchor, vector: Position, complete?: boolean) => {
      resizeWidgets({
        anchor,
        widgets: selectedWidgets,
        vector: toGridPosition(vector, cellSize),
        complete,
      });
    },
    [selectedWidgets, cellSize, resizeWidgets]
  );

  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const onResizeStart = (anchor: Anchor | null) => {
    setAnchor(anchor);
    setActiveGesture('resize');
  };
  const onResizeUpdate = (dragEvent: DragEvent) => {
    if (!anchor) return;
    handleResizeWidgets(anchor, dragEvent.vector, false);
  };
  const onResizeEnd = (dragEvent: DragEvent) => {
    if (!anchor) return;
    handleResizeWidgets(anchor, dragEvent.vector, true);
    setAnchor(null);
  };

  return {
    onResizeStart,
    onResizeUpdate,
    onResizeEnd,
  };
};
