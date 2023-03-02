import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onMoveWidgetsAction } from '~/store/actions';
import { DashboardState } from '~/store/state';
import { Position, Widget } from '~/types';
import { toGridPosition } from '~/util/position';
import { DragEvent } from '../../grid';
import { Gesture } from './types';

type MoveHooksProps = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  selectedWidgets: Widget[];
  cellSize: DashboardState['grid']['cellSize'];
};

export const useMoveGestures = ({ setActiveGesture, selectedWidgets, cellSize }: MoveHooksProps) => {
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
    [selectedWidgets, cellSize]
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
