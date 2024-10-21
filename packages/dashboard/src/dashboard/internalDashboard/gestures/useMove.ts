import React, { useCallback } from 'react';
import type { DragEvent } from '~/features/dashboard-canvas';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import { toGridPosition } from '~/helpers/position';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useMoveWidgets } from '~/store/dashboard/use-move-widgets';
import type { Position } from '~/types';
import type { Gesture } from './types';

type MoveHooksProps = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
};

export const useMoveGestures = ({ setActiveGesture }: MoveHooksProps) => {
  const selectedWidgets = useSelectedWidgets();
  const [cellSize] = useDashboardCellSize();
  const moveWidgets = useMoveWidgets();

  const handleMoveWidgets = useCallback(
    (vector: Position, complete?: boolean) => {
      moveWidgets({
        widgets: selectedWidgets,
        vector: toGridPosition(vector, cellSize),
        complete,
      });
    },
    [selectedWidgets, moveWidgets, cellSize]
  );

  const onMoveStart = () => {
    setActiveGesture('move');
  };
  const onMoveUpdate = (dragEvent: DragEvent) => {
    handleMoveWidgets(dragEvent.vector, false);
  };
  const onMoveEnd = (dragEvent: DragEvent) => {
    handleMoveWidgets(dragEvent.vector, true);
  };

  return {
    onMoveStart,
    onMoveUpdate,
    onMoveEnd,
  };
};
