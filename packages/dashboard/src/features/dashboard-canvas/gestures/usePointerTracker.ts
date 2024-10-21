import { type PointerEventHandler, useState } from 'react';
import {
  DASHBOARD_CONTAINER_ID,
  getDashboardPosition,
} from '../getDashboardPosition';
import { endTracker, startTracker } from './positionTracker';
import type { PointClickEvent } from './types';

export type PointerTrackerProps = {
  readOnly: boolean;
  enabled: boolean;
  union: boolean;
  click: (e: PointClickEvent) => void;
};

/**
 *
 * Tracks the pointer position and intended target of the drag and drop gesture
 *
 * Tracks the current bounding rect of the grid area which is used to
 * make sure drag operations are correctly handled when the pointer leaves the grid
 *
 * Handles the point click gesture
 *
 */
export const usePointerTracker = ({
  readOnly,
  enabled,
  union,
  click,
}: PointerTrackerProps) => {
  const [dashboardGrid, setDashboardGrid] = useState<DOMRect | null>(null);
  const [target, setTarget] = useState<EventTarget | undefined>();
  const [cancelClick, setCancelClick] = useState(false);

  const onPointerDown: PointerEventHandler = (e) => {
    if (readOnly) return;
    setTarget(e.target);
    setCancelClick(false);
    const dashboardGrid = document
      .getElementById(DASHBOARD_CONTAINER_ID)
      ?.getBoundingClientRect();
    if (dashboardGrid) {
      setDashboardGrid(dashboardGrid);
    }
    startTracker.setPosition(getDashboardPosition(e));
    endTracker.setPosition(getDashboardPosition(e));
  };

  const onPointerUp: PointerEventHandler = (e) => {
    if (cancelClick || !enabled || readOnly) return;
    if (e.button === 0) {
      click({
        position: getDashboardPosition(e),
        union,
      });
    }
  };

  return {
    dashboardGrid,
    target,
    setCancelClick,
    onPointerDown,
    onPointerUp,
  };
};
