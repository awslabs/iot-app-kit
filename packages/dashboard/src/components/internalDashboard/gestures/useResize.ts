import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Anchor, onResizeWidgetsAction } from '~/store/actions';
import { DashboardState } from '~/store/state';
import { Position, Widget } from '~/types';
import { toGridPosition } from '~/util/position';
import { DragEvent } from '../../grid';
import { Gesture } from './types';

type ResizeHooksProps = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  selectedWidgets: Widget[];
  cellSize: DashboardState['grid']['cellSize'];
};

export const useResizeGestures = ({ setActiveGesture, selectedWidgets, cellSize }: ResizeHooksProps) => {
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
    [selectedWidgets, cellSize]
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
