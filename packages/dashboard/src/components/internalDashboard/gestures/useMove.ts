import type * as React from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onMoveWidgetsAction } from '../../../store/actions';
import type { DashboardState } from '../../../store/state';
import type { DashboardWidget, Position } from '../../../types';
import { toGridPosition } from '../../../util/position';
import type { DragEvent } from '../../grid';
import type { Gesture } from './types';

type MoveHooksProps = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  selectedWidgets: DashboardWidget[];
  cellSize: DashboardState['grid']['cellSize'];
};

export const useMoveGestures = ({
  setActiveGesture,
  selectedWidgets,
  cellSize,
}: MoveHooksProps) => {
  const dispatch = useDispatch();

  const moveWidgets = useCallback(
    (vector: Position, complete?: boolean) => {
      dispatch(
        onMoveWidgetsAction({
          widgets: selectedWidgets,
          vector: toGridPosition(vector, cellSize),
          complete,
        })
      );
    },
    [selectedWidgets, cellSize, dispatch]
  );

  const onMoveStart = () => {
    setActiveGesture('move');
  };
  const onMoveUpdate = (dragEvent: DragEvent) => {
    moveWidgets(dragEvent.vector, false);
  };
  const onMoveEnd = (dragEvent: DragEvent) => {
    moveWidgets(dragEvent.vector, true);
  };

  return {
    onMoveStart,
    onMoveUpdate,
    onMoveEnd,
  };
};
