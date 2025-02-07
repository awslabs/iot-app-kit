import { type Dispatch, type SetStateAction, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onMoveWidgetsAction } from '~/store/actions';
import type { DashboardState } from '~/store/state';
import type { Position } from '~/types';
import { toGridPosition } from '~/util/position';
import type { DragEvent } from '../../grid';
import type { Gesture } from './types';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface UseMoveWidgetsOptions {
  setActiveGesture: Dispatch<SetStateAction<Gesture>>;
  selectedWidgets: WidgetInstance[];
  cellSize: DashboardState['grid']['cellSize'];
}

export const useMoveWidgets = ({
  setActiveGesture,
  selectedWidgets,
  cellSize,
}: UseMoveWidgetsOptions) => {
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
