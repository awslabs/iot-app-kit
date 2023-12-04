import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { MouseEvent, FC, ReactNode } from 'react';

import { spaceStaticXs } from '@cloudscape-design/design-tokens';
import {
  LEFT_WIDTH_PERCENT,
  MINIMUM_CENTER_PANE_WIDTH,
  DEFAULT_SIDE_PANE_WIDTH,
  DEFAULT_COLLAPSED_SIDE_PANE_WIDTH,
  MAXIMUM_PANES_PROPORTION,
  LEFT_WIDTH_PERCENT_STORAGE_KEY,
  MINIMUM_LEFT_SIDE_PANE_WIDTH,
  MAXIMUM_LEFT_SIDE_PANE_WIDTH,
} from './constants';

import './index.css';
import { CollapsiblePanel } from '../internalDashboard/collapsiblePanel';
import resourceExplorerPanelIcon from './assets/resourceExplorer.svg';
import PropertiesPanelIcon from './assets/propertiesPane.svg';

const getSessionStorageNumber = (key: string, fallback: number) => {
  const stored = sessionStorage.getItem(key);
  if (stored) return parseFloat(stored);
  return fallback;
};

const getStoredLeftWidthPercent = () => getSessionStorageNumber(LEFT_WIDTH_PERCENT_STORAGE_KEY, LEFT_WIDTH_PERCENT);

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
  const [currentDragHandle, setCurrentDragHandle] = useState<'left' | null>(null);

  /** Last seen mouse x position during a drag, in px from screen left side */
  const [lastSeenAtX, setLastSeenAtX] = useState<number | null>(null);

  /** Total x distance moved during a drag, in px */
  const [movedX, setMovedX] = useState<number | null>(null);

  /** Current widths of the three panes, in px */
  const [leftPaneWidth, setLeftPaneWidth] = useState(DEFAULT_SIDE_PANE_WIDTH);
  const [rightPaneWidth, setRightPaneWidth] = useState(DEFAULT_SIDE_PANE_WIDTH);
  const [isRightPaneCollapsed, setRightPaneCollapsed] = useState(true);
  const [isLeftPaneCollapsed, setLeftPaneCollapsed] = useState(false);

  useEffect(() => {
    // On initial load, attempt to get stored widths from sessionStorage.
    // Otherwise, measure the panes element and set side pane widths to default
    // percentages of its width, or the minimum width, whichever is larger.

    const el = panes.current as HTMLElement | null;
    if (!el) return;

    const storedLeftWidthPercent = getStoredLeftWidthPercent();
    const elementWidth = el.offsetWidth;

    if (storedLeftWidthPercent) {
      const storedLeftWidth = elementWidth * storedLeftWidthPercent;
      setLeftPaneWidth(storedLeftWidth > DEFAULT_SIDE_PANE_WIDTH ? storedLeftWidth : DEFAULT_SIDE_PANE_WIDTH);
    } else {
      const computedLeftPaneWidth = elementWidth * LEFT_WIDTH_PERCENT;
      const computedLeftPaneWidthWithMinimums =
        computedLeftPaneWidth > DEFAULT_SIDE_PANE_WIDTH ? computedLeftPaneWidth : DEFAULT_SIDE_PANE_WIDTH;

      setLeftPaneWidth(computedLeftPaneWidthWithMinimums);
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

      // limit left pane's min and max width
      const minMaxLeftPaneWidth = Math.min(
        Math.max(nextLeftPaneWidth, MINIMUM_LEFT_SIDE_PANE_WIDTH),
        MAXIMUM_LEFT_SIDE_PANE_WIDTH
      );

      // Persist percentage with sessionStorage
      setLeftPaneWidth(minMaxLeftPaneWidth);
      const nextLeftPaneWidthPercent = nextLeftPaneWidth / elementWidth;
      sessionStorage.setItem(LEFT_WIDTH_PERCENT_STORAGE_KEY, nextLeftPaneWidthPercent.toString());
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

  const resizeSidePanes = useCallback(() => {
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

    // If proportions are too high, or next pane width is larger than minimum
    // size, use minimum size as next pane width instead.
    const nextLeftPaneWidth =
      maybeNextLeftPaneWidth > DEFAULT_SIDE_PANE_WIDTH ? maybeNextLeftPaneWidth : DEFAULT_SIDE_PANE_WIDTH;

    // Persist percentages with sessionStorage
    const nextLeftPaneWidthPercent = nextLeftPaneWidth / elementWidth;
    sessionStorage.setItem(LEFT_WIDTH_PERCENT_STORAGE_KEY, nextLeftPaneWidthPercent.toString());

    // Set pane widths
    setLeftPaneWidth(nextLeftPaneWidth);
  }, [rightPaneWidth, leftPaneWidth]);

  // expand and collapse left pane
  const onLeftCollapsedPaneClick = () => {
    if (isLeftPaneCollapsed) {
      setLeftPaneWidth(DEFAULT_SIDE_PANE_WIDTH);
      setLeftPaneCollapsed(false);
      resizeSidePanes();
    } else {
      setLeftPaneWidth(DEFAULT_COLLAPSED_SIDE_PANE_WIDTH);
      setLeftPaneCollapsed(true);
    }
  };

  // expand and collapse right pane
  const onRightCollapsedPaneClick = () => {
    if (isRightPaneCollapsed) {
      setRightPaneWidth(DEFAULT_SIDE_PANE_WIDTH);
      setRightPaneCollapsed(false);
    } else {
      setRightPaneWidth(DEFAULT_COLLAPSED_SIDE_PANE_WIDTH);
      setRightPaneCollapsed(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resizeSidePanes);
    return () => window.removeEventListener('resize', resizeSidePanes);
  }, [leftPaneWidth, resizeSidePanes]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className='iot-resizable-panes'
      ref={panes}
      onMouseDown={(e) => onHandleDragStart(e)}
      onMouseMove={(e) => onHandleDragMove(e)}
      onMouseUp={() => onHandleDragEnd()}
      style={{
        gridTemplateColumns: `max-content ${isLeftPaneCollapsed ? '0px' : `${spaceStaticXs}`} auto 0px max-content`,
      }}
    >
      <CollapsiblePanel
        isPanelCollapsed={isLeftPaneCollapsed}
        panelWidth={leftPaneWidth}
        onCollapsedPanelClick={onLeftCollapsedPaneClick}
        panelContent={leftPane}
        icon={resourceExplorerPanelIcon}
        side='left'
        headerText='Resource explorer'
      />

      <div
        className={!isLeftPaneCollapsed ? 'iot-resizable-panes-handle iot-resizable-panes-handle-left' : ''}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      />

      <div style={{ pointerEvents }} className='iot-resizable-panes-pane iot-resizable-panes-pane-center'>
        {centerPane}
      </div>

      <div
        className={!isRightPaneCollapsed ? 'iot-resizable-panes-handle iot-resizable-panes-handle-right' : ''}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      />

      <CollapsiblePanel
        isPanelCollapsed={isRightPaneCollapsed}
        panelWidth={rightPaneWidth}
        onCollapsedPanelClick={onRightCollapsedPaneClick}
        panelContent={rightPane}
        icon={PropertiesPanelIcon}
        side='right'
        headerText='Configuration'
      />
    </div>
  );
};
