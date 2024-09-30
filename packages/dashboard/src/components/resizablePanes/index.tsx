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
import { useDispatch, useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { onToggleChatbotAction } from '~/store/actions/toggleChatbot';

const getSessionStorageNumber = (key: string, fallback: number) => {
  const stored = sessionStorage.getItem(key);
  if (stored) return parseFloat(stored);
  return fallback;
};

const getStoredLeftWidthPercent = () =>
  getSessionStorageNumber(LEFT_WIDTH_PERCENT_STORAGE_KEY, LEFT_WIDTH_PERCENT);

type ResizablePanesProps = {
  leftPane?: ReactNode;
  centerPane: ReactNode;
  rightPane: ReactNode;
  rightPaneOptions: {
    icon: string;
    iconBackground?: string;
    headerText: string;
    hideHeader: boolean;
  };
};

export const ResizablePanes: FC<ResizablePanesProps> = ({
  leftPane,
  centerPane,
  rightPane,
  ...props
}) => {
  const panes = useRef(null);
  const dispatch = useDispatch();

  // Used to prevent any scroll events leaking to the grid component on resize
  const [pointerEvents, setPointerEvents] = useState<'auto' | 'none'>('auto');

  /** Currently active drag hangle during a drag, or null if not dragging */
  const [currentDragHandle, setCurrentDragHandle] = useState<'left' | null>(
    null
  );

  /** Last seen mouse x position during a drag, in px from screen left side */
  const [lastSeenAtX, setLastSeenAtX] = useState<number | null>(null);

  /** Total x distance moved during a drag, in px */
  const [movedX, setMovedX] = useState<number | null>(null);

  /** Current widths of the three panes, in px */
  const [isRightPaneCollapsed, setRightPaneCollapsed] = useState(true);
  const [isLeftPaneCollapsed, setLeftPaneCollapsed] = useState(
    leftPane === null
  );
  const [isChatOpened, setChatOpened] = useState(false);
  // left panel open by default
  const [leftPaneWidth, setLeftPaneWidth] = useState(DEFAULT_SIDE_PANE_WIDTH);
  // right panel closed by default
  const [rightPaneWidth, setRightPaneWidth] = useState(
    DEFAULT_COLLAPSED_SIDE_PANE_WIDTH
  );

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
      setLeftPaneWidth(
        storedLeftWidth > DEFAULT_SIDE_PANE_WIDTH
          ? storedLeftWidth
          : DEFAULT_SIDE_PANE_WIDTH
      );
    } else {
      const computedLeftPaneWidth = elementWidth * LEFT_WIDTH_PERCENT;
      const computedLeftPaneWidthWithMinimums =
        computedLeftPaneWidth > DEFAULT_SIDE_PANE_WIDTH
          ? computedLeftPaneWidth
          : DEFAULT_SIDE_PANE_WIDTH;

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
      if (
        target.classList &&
        target.classList.contains('iot-resizable-panes-handle')
      ) {
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
      if (
        nextLeftPaneWidth + rightPaneWidth >=
        elementWidth - MINIMUM_CENTER_PANE_WIDTH
      ) {
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
      sessionStorage.setItem(
        LEFT_WIDTH_PERCENT_STORAGE_KEY,
        nextLeftPaneWidthPercent.toString()
      );
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
      while (
        nextLeftProportion + nextRightProportion >
        MAXIMUM_PANES_PROPORTION
      ) {
        nextLeftProportion = nextLeftProportion * 0.99;
        nextRightProportion = nextRightProportion * 0.99;
      }
    }

    // Scale down the panes in proportion to their current size.
    const maybeNextLeftPaneWidth = elementWidth * nextLeftProportion;

    // If proportions are too high, or next pane width is larger than minimum
    // size, use minimum size as next pane width instead.
    const nextLeftPaneWidth =
      maybeNextLeftPaneWidth > DEFAULT_SIDE_PANE_WIDTH
        ? maybeNextLeftPaneWidth
        : DEFAULT_SIDE_PANE_WIDTH;

    // Persist percentages with sessionStorage
    const nextLeftPaneWidthPercent = nextLeftPaneWidth / elementWidth;
    sessionStorage.setItem(
      LEFT_WIDTH_PERCENT_STORAGE_KEY,
      nextLeftPaneWidthPercent.toString()
    );

    // Set pane widths
    setLeftPaneWidth(nextLeftPaneWidth);
  }, [rightPaneWidth, leftPaneWidth]);

  // expand and collapse left pane
  const onLeftCollapsedPaneClick = () => {
    if (isLeftPaneCollapsed) {
      setLeftPaneWidth(DEFAULT_SIDE_PANE_WIDTH);
      setLeftPaneCollapsed(false);
      resizeSidePanes();

      handleClosePanelIfScreenSizeIsTooSmall('right');
    } else {
      setLeftPaneWidth(DEFAULT_COLLAPSED_SIDE_PANE_WIDTH);
      setLeftPaneCollapsed(true);
    }
  };

  // expand and collapse right pane
  const handleRightPaneCollapse = () => {
    if (isRightPaneCollapsed) {
      setRightPaneWidth(DEFAULT_SIDE_PANE_WIDTH);
      setRightPaneCollapsed(false);

      handleClosePanelIfScreenSizeIsTooSmall('left');
    } else {
      setRightPaneWidth(DEFAULT_COLLAPSED_SIDE_PANE_WIDTH);
      setRightPaneCollapsed(true);
    }
  };

  const onRightCollapsedPaneClick = () => {
    handleRightPaneCollapse();
    if (props.rightPaneOptions.headerText === 'AI Assistant') {
      setChatOpened(!isChatOpened);
      dispatch(
        onToggleChatbotAction({
          open: !isChatOpened,
          componentId: '',
          messages: assistant.messages,
        })
      );
    }
  };

  const assistant = useSelector((state: DashboardState) => state.assistant);
  useEffect(() => {
    if (isChatOpened !== assistant.isChatbotOpen) {
      handleRightPaneCollapse();
      setChatOpened(!isChatOpened);
    }
  }, [assistant.isChatbotOpen]);

  useEffect(() => {
    const handleWindowResize = () => {
      resizeSidePanes();
      // prefer left pane if both are open
      if (!isLeftPaneCollapsed) {
        handleClosePanelIfScreenSizeIsTooSmall('right');
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [leftPaneWidth, isLeftPaneCollapsed, resizeSidePanes]);

  /**
   *
   * Accessibility patch
   * In order to avoid horizontal scrolling when the window is small or zoomed in far
   * we will only have one panel open at a time
   * after the panes element is smaller than the threshold
   */
  const handleClosePanelIfScreenSizeIsTooSmall = (
    panelToClose: 'left' | 'right'
  ) => {
    const el = panes.current as HTMLElement | null;
    if (!el) return;

    // both panels initial open size + the left panels resize grab handle
    const handleWidth = 8;
    const shouldClosePanel =
      el.offsetWidth <= 2 * DEFAULT_SIDE_PANE_WIDTH + handleWidth;

    if (!shouldClosePanel) return;

    switch (panelToClose) {
      case 'left':
        setLeftPaneCollapsed(true);
        break;
      case 'right':
        setRightPaneCollapsed(true);
        break;
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className='iot-resizable-panes'
      ref={panes}
      onMouseDown={(e) => onHandleDragStart(e)}
      onMouseMove={(e) => onHandleDragMove(e)}
      onMouseUp={() => onHandleDragEnd()}
      style={{
        gridTemplateColumns: `max-content ${
          isLeftPaneCollapsed ? '0px' : `${spaceStaticXs}`
        } auto 0px max-content`,
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
        className={
          !isLeftPaneCollapsed
            ? 'iot-resizable-panes-handle iot-resizable-panes-handle-left'
            : ''
        }
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      />

      <div
        style={{ pointerEvents }}
        className='iot-resizable-panes-pane iot-resizable-panes-pane-center'
      >
        {centerPane}
      </div>

      <div
        className={
          !isRightPaneCollapsed
            ? 'iot-resizable-panes-handle iot-resizable-panes-handle-right'
            : ''
        }
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      />

      <CollapsiblePanel
        isPanelCollapsed={isRightPaneCollapsed}
        panelWidth={rightPaneWidth}
        onCollapsedPanelClick={onRightCollapsedPaneClick}
        panelContent={rightPane}
        side='right'
        {...props.rightPaneOptions}
      />
    </div>
  );
};
