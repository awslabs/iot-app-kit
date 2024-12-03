import type * as React from 'react';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSelectWidgetsAction } from '../../../store/actions';
import type { DashboardState } from '../../../store/state';
import type { DashboardWidget, Position, Selection } from '../../../types';
import {
  getSelectedWidgets,
  pointSelect,
  selectedRect,
} from '../../../util/select';
import type { DragEvent } from '../../grid';
import type { Gesture } from './types';

type SelectionHooksProps = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  dashboardWidgets: DashboardWidget[];
  cellSize: DashboardState['grid']['cellSize'];
};

export const useSelectionGestures = ({
  setActiveGesture,
  dashboardWidgets,
  cellSize,
}: SelectionHooksProps) => {
  const dispatch = useDispatch();
  const selectWidgets = useCallback(
    (widgets: DashboardWidget[], union: boolean) => {
      dispatch(
        onSelectWidgetsAction({
          widgets,
          union,
        })
      );
    },
    [dispatch]
  );

  const [userSelection, setUserSelection] = useState<Selection | undefined>(
    undefined
  );

  const onPointSelect = useCallback(
    ({ position, union }: { position: Position; union: boolean }) => {
      const intersectedWidget = pointSelect({
        dashboardWidgets,
        cellSize,
        position,
      });

      selectWidgets(intersectedWidget ? [intersectedWidget] : [], union);
    },
    [dashboardWidgets, cellSize, selectWidgets]
  );

  const onSelectionStart = (dragEvent: DragEvent) => {
    setActiveGesture('select');
    setUserSelection({
      start: dragEvent.start,
      end: dragEvent.end,
    });
  };

  const onSelectionUpdate = useCallback(
    (dragEvent: DragEvent) => {
      const updatedSelection = {
        start: dragEvent.start,
        end: dragEvent.end,
      };
      setUserSelection(updatedSelection);

      const union = dragEvent.union;

      const intersectedWidgets = getSelectedWidgets({
        selectedRect: selectedRect(updatedSelection),
        dashboardWidgets,
        cellSize,
      });

      selectWidgets(intersectedWidgets, union);
    },
    [dashboardWidgets, cellSize, selectWidgets]
  );

  const onSelectionEnd = () => {
    setUserSelection(undefined);
  };

  return {
    userSelection,
    onPointSelect,
    onSelectionStart,
    onSelectionUpdate,
    onSelectionEnd,
  };
};
