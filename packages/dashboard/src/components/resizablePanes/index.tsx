import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import type { MouseEvent, FC, ReactNode } from 'react';

export const LEFT_WIDTH_PERCENT = 0.2;
export const RIGHT_WIDTH_PERCENT = 0.2;
export const MINIMUM_CENTER_PANE_WIDTH = 100;
export const MINIMUM_SIDE_PANE_WIDTH = 100;
const DEFAULT_SIDE_PANE_WIDTH = 250;
export const HANDLE_WIDTH = 10;
export const MAXIMUM_PANES_PROPORTION = 0.8;
export const LEFT_WIDTH_PERCENT_STORAGE_KEY = 'iot-dashboard-pane-left-width';
export const RIGHT_WIDTH_PERCENT_STORAGE_KEY = 'iot-dashboard-pane-right-width';

const getSessionStorageNumber = (key: string, fallback: number) => {
  const stored = sessionStorage.getItem(key);
  if (stored) return parseFloat(stored);
  return fallback;
};

const getStoredLeftWidthPercent = () => getSessionStorageNumber(LEFT_WIDTH_PERCENT_STORAGE_KEY, LEFT_WIDTH_PERCENT);
const getStoredRightWidthPercent = () => getSessionStorageNumber(RIGHT_WIDTH_PERCENT_STORAGE_KEY, RIGHT_WIDTH_PERCENT);

type ResizablePanesProps = {
  leftPane: ReactNode;
  centerPane: ReactNode;
  rightPane: ReactNode;
};

export const ResizablePanes: FC<ResizablePanesProps> = ({ leftPane, centerPane, rightPane }) => {
  const panes = useRef(null);

  // Used to prevent any scroll events leaking to the grid component on resize
  const [pointerEvents, setPointerEvents] = useState<'auto' | 'none'>('auto');

  /** Currently active drag hangle during a drag, or null if not dragging */
  const [currentDragHandle, setCurrentDragHandle] = useState<'left' | 'right' | null>(null);

  /** Last seen mouse x position during a drag, in px from screen left side */
  const [lastSeenAtX, setLastSeenAtX] = useState<number | null>(null);

  /** Total x distance moved during a drag, in px */
  const [movedX, setMovedX] = useState<number | null>(null);

  /** Current widths of the three panes, in px */
  const [leftPaneWidth, setLeftPaneWidth] = useState(DEFAULT_SIDE_PANE_WIDTH);
  const [rightPaneWidth, setRightPaneWidth] = useState(DEFAULT_SIDE_PANE_WIDTH);

  useEffect(() => {
    // On initial load, attempt to get stored widths from sessionStorage.
    // Otherwise, measure the panes element and set side pane widths to default
    // percentages of its width, or the minimum width, whichever is larger.

    const el = panes.current as HTMLElement | null;
    if (!el) return;

    const storedLeftWidthPercent = getStoredLeftWidthPercent();
    const storedRightWidthPercent = getStoredRightWidthPercent();
    const elementWidth = el.offsetWidth;

    if (storedLeftWidthPercent) {
      const storedLeftWidth = elementWidth * storedLeftWidthPercent;
      setLeftPaneWidth(storedLeftWidth);
    } else {
      const computedLeftPaneWidth = elementWidth * LEFT_WIDTH_PERCENT;
      const computedLeftPaneWidthWithMinimums =
        computedLeftPaneWidth > MINIMUM_SIDE_PANE_WIDTH ? computedLeftPaneWidth : MINIMUM_SIDE_PANE_WIDTH;
      setLeftPaneWidth(computedLeftPaneWidthWithMinimums);
    }

    if (storedRightWidthPercent) {
      const storedRightWidth = elementWidth * storedRightWidthPercent;
      setRightPaneWidth(storedRightWidth);
    } else {
      const computedRightPaneWidth = elementWidth * RIGHT_WIDTH_PERCENT;
      const computedRightPaneWidthWithMinimums =
        computedRightPaneWidth > MINIMUM_SIDE_PANE_WIDTH ? computedRightPaneWidth : MINIMUM_SIDE_PANE_WIDTH;
      setRightPaneWidth(computedRightPaneWidthWithMinimums);
    }
  }, []);

  /**
   * Drag handlers
   */

  const cancelDrag = () => {
    setCurrentDragHandle(null);
    setLastSeenAtX(null);
    setMovedX(null);
  };

  const onHandleDragStart = (event: MouseEvent) => {
    const target = event.target;
    if (target instanceof Element) {
      if (target.classList && target.classList.contains('iot-resizable-panes-handle')) {
        setLastSeenAtX(event.clientX);
        setMovedX(0);
        setPointerEvents('none');
        if (target.classList.contains('iot-resizable-panes-handle-left')) {
          setCurrentDragHandle('left');
        } else {
          setCurrentDragHandle('right');
        }
      }
    }
  };

  const onHandleDragMove = (event: MouseEvent) => {
    const el = panes.current as HTMLElement | null;
    if (!el) return;
    const elementWidth = el.offsetWidth;

    if (!currentDragHandle || lastSeenAtX === null || movedX === null) return;

    setMovedX(-(lastSeenAtX - event.clientX));
    setLastSeenAtX(event.clientX);

    if (currentDragHandle === 'left') {
      const nextLeftPaneWidth = leftPaneWidth + movedX;

      // Stop drag when dragged pane runs into other pane
      if (nextLeftPaneWidth + rightPaneWidth >= elementWidth - MINIMUM_CENTER_PANE_WIDTH) {
        cancelDrag();
        return;
      }

      // Persist percentage with sessionStorage
      setLeftPaneWidth(nextLeftPaneWidth);
      const nextLeftPaneWidthPercent = nextLeftPaneWidth / elementWidth;
      sessionStorage.setItem(LEFT_WIDTH_PERCENT_STORAGE_KEY, nextLeftPaneWidthPercent.toString());
    }

    if (currentDragHandle === 'right') {
      const nextRightPaneWidth = rightPaneWidth - movedX;

      // Stop drag when dragged pane runs into other pane
      if (nextRightPaneWidth + leftPaneWidth >= elementWidth - MINIMUM_CENTER_PANE_WIDTH) {
        cancelDrag();
        return;
      }

      // Persist percentage with sessionStorage
      setRightPaneWidth(nextRightPaneWidth);
      const nextRightPaneWidthPercent = nextRightPaneWidth / elementWidth;
      sessionStorage.setItem(RIGHT_WIDTH_PERCENT_STORAGE_KEY, nextRightPaneWidthPercent.toString());
    }
  };

  const onHandleDragEnd = () => {
    cancelDrag();
    setPointerEvents('auto');
  };

  /**
   * Because the width of left/right panes is hardcoded, resizing the screen
   * to a smaller width can cause collisions. This method resizes side panes
   * proportionally when the screen is resized to prevent these collisions.
   */

  const resizeSidePanes = () => {
    const el = panes.current as HTMLElement | null;
    if (!el) return;
    const elementWidth = el.offsetWidth;

    // Set next proportion for panes. If proportions added exceed a threshold,
    // scale them down until they do not.
    const leftProportion = leftPaneWidth / elementWidth;
    const rightProportion = rightPaneWidth / elementWidth;
    let nextLeftProportion = leftProportion;
    let nextRightProportion = rightProportion;

    if (nextLeftProportion + nextRightProportion > MAXIMUM_PANES_PROPORTION) {
      while (nextLeftProportion + nextRightProportion > MAXIMUM_PANES_PROPORTION) {
        nextLeftProportion = nextLeftProportion * 0.99;
        nextRightProportion = nextRightProportion * 0.99;
      }
    }

    // Scale down the panes in proportion to their current size.
    const maybeNextLeftPaneWidth = elementWidth * nextLeftProportion;
    const maybeNextRightPaneWidth = elementWidth * nextRightProportion;

    // If proportions are too high, or next pane width is larger than minimum
    // size, use minimum size as next pane width instead.
    const nextLeftPaneWidth =
      maybeNextLeftPaneWidth > MINIMUM_SIDE_PANE_WIDTH ? maybeNextLeftPaneWidth : MINIMUM_SIDE_PANE_WIDTH;
    const nextRightPaneWidth =
      maybeNextRightPaneWidth > MINIMUM_SIDE_PANE_WIDTH ? maybeNextRightPaneWidth : MINIMUM_SIDE_PANE_WIDTH;

    // Persist percentages with sessionStorage
    const nextRightPaneWidthPercent = nextRightPaneWidth / elementWidth;
    sessionStorage.setItem(RIGHT_WIDTH_PERCENT_STORAGE_KEY, nextRightPaneWidthPercent.toString());
    const nextLeftPaneWidthPercent = nextLeftPaneWidth / elementWidth;
    sessionStorage.setItem(LEFT_WIDTH_PERCENT_STORAGE_KEY, nextLeftPaneWidthPercent.toString());

    // Set pane widths
    setLeftPaneWidth(nextLeftPaneWidth);
    setRightPaneWidth(nextRightPaneWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeSidePanes);
    return () => window.removeEventListener('resize', resizeSidePanes);
  }, [leftPaneWidth, rightPaneWidth]);

  return (
    <div
      className='iot-resizable-panes'
      ref={panes}
      onMouseDown={(e) => onHandleDragStart(e)}
      onMouseMove={(e) => onHandleDragMove(e)}
      onMouseUp={() => onHandleDragEnd()}
    >
      <div className='iot-resizable-panes-pane iot-resizable-panes-pane-left' style={{ width: `${leftPaneWidth}px` }}>
        {leftPane}
      </div>

      <div
        className='iot-resizable-panes-handle iot-resizable-panes-handle-left'
        style={{ width: `${HANDLE_WIDTH}px` }}
        tabIndex={0}
      />

      <div style={{ pointerEvents }} className='iot-resizable-panes-pane iot-resizable-panes-pane-center'>
        {centerPane}
      </div>

      <div
        className='iot-resizable-panes-handle iot-resizable-panes-handle-right'
        style={{ width: `${HANDLE_WIDTH}px` }}
        tabIndex={0}
      />

      <div className='iot-resizable-panes-pane iot-resizable-panes-pane-right' style={{ width: `${rightPaneWidth}px` }}>
        {rightPane}
      </div>
    </div>
  );
};
