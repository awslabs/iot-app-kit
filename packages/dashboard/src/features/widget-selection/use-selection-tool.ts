import React, { useCallback, useState } from 'react';
import {
  getSelectedWidgets,
  pointSelect,
  selectedRect,
} from '~/features/widget-selection/select';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useWidgets } from '~/store/dashboard/use-widgets';
import type { Position, Selection } from '~/types';
import type { Gesture } from '../../dashboard/internalDashboard/gestures/types';
import type { DragEvent } from '../dashboard-canvas';
import { useSelectWidgets } from './use-select-widgets';

type UseSelectionToolOptions = {
  setActiveGesture: React.Dispatch<React.SetStateAction<Gesture>>;
};

export const useSelectionTool = ({
  setActiveGesture,
}: UseSelectionToolOptions) => {
  const widgets = useWidgets();
  const [cellSize] = useDashboardCellSize();
  const { select, selectAdditional } = useSelectWidgets();

  const [userSelection, setUserSelection] = useState<Selection | undefined>(
    undefined
  );

  const onPointSelect = useCallback(
    ({ position, union }: { position: Position; union: boolean }) => {
      const intersectedWidget = pointSelect({
        dashboardWidgets: widgets,
        cellSize,
        position,
      });

      if (union) {
        selectAdditional({
          widgetIds: intersectedWidget ? [intersectedWidget.id] : [],
        });
      } else {
        select({ widgetIds: intersectedWidget ? [intersectedWidget.id] : [] });
      }
    },
    [widgets, cellSize, select, selectAdditional]
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
        dashboardWidgets: widgets,
        cellSize,
      });

      if (union) {
        selectAdditional({ widgetIds: intersectedWidgets.map(({ id }) => id) });
      } else {
        select({ widgetIds: intersectedWidgets.map(({ id }) => id) });
      }
    },
    [widgets, cellSize, select, selectAdditional]
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
