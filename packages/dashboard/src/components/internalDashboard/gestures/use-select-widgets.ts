import { useCallback, useState } from 'react';
import type * as React from 'react';
import { useDispatch } from 'react-redux';
import { onSelectWidgetsAction } from '~/store/actions';
import {
  getSelectedWidgets,
  pointSelect,
  selectedRect,
  type Selection,
} from '~/util/select';
import type { DashboardState } from '~/store/state';
import type { Position } from '~/types';
import type { DragEvent } from '../../grid';
import type { Gesture } from './types';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface UseSelectWidgetsOptions {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
  dashboardWidgets: WidgetInstance[];
  cellSize: DashboardState['grid']['cellSize'];
}

export const useSelectWidgets = ({
  setActiveGesture,
  dashboardWidgets,
  cellSize,
}: UseSelectWidgetsOptions) => {
  const dispatch = useDispatch();
  const selectWidgets = useCallback(
    (widgets: WidgetInstance[], union: boolean) => {
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
