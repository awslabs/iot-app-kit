import type * as React from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onMoveWidgetsAction } from '~/store/actions';
import { toGridPosition } from '~/util/position';
import type { DashboardState } from '~/store/state';
import type { Position } from '~/types';
import type { DragEvent } from '../../grid';
import type { Gesture } from './types';

export interface UseMoveGesturesOptions {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  selectedWidgetIds: readonly string[];
  cellSize: DashboardState['grid']['cellSize'];
}

export const useMoveGestures = ({
  setActiveGesture,
  selectedWidgetIds,
  cellSize,
}: UseMoveGesturesOptions) => {
  const dispatch = useDispatch();

  const moveWidgets = useCallback(
    (vector: Position, complete?: boolean) => {
      dispatch(
        onMoveWidgetsAction({
          widgetIds: selectedWidgetIds,
          vector: toGridPosition(vector, cellSize),
          complete,
        })
      );
    },
    [selectedWidgetIds, cellSize, dispatch]
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
