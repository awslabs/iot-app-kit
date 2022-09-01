import { Component, State, Listen, h } from '@stencil/core';
import { CustomEvent } from '../../decorators/events';

const LEFT_WIDTH_PERCENT = 0.15;
const RIGHT_WIDTH_PERCENT = 0.15;
const MINIMUM_CENTER_PANE_WIDTH = 80;
const MINIMUM_SIDE_PANE_WIDTH = 80;
const HANDLE_WIDTH = 10;
const MAXIMUM_PANES_PROPORTION = 0.9;
const LEFT_WIDTH_PERCENT_STORAGE_KEY = 'iot-dashboard-pane-left-width';
const RIGHT_WIDTH_PERCENT_STORAGE_KEY = 'iot-dashboard-pane-right-width';

const getSessionStorageNumber = (key: string, fallback: number) => {
  const stored = sessionStorage.getItem(key);
  if (stored) return parseFloat(stored);
  return fallback;
};

const getStoredLeftWidthPercent = () => getSessionStorageNumber(LEFT_WIDTH_PERCENT_STORAGE_KEY, LEFT_WIDTH_PERCENT);
const getStoredRightWidthPercent = () => getSessionStorageNumber(RIGHT_WIDTH_PERCENT_STORAGE_KEY, RIGHT_WIDTH_PERCENT);

@Component({
  tag: 'iot-resizable-panes',
  styleUrl: 'iot-resizable-panes.css',
})
export class IotResizablePanes {
  /** Currently active drag hangle during a drag, or null if not dragging */
  @State() currentDragHandle: 'left' | 'right' | null = null;

  /** Last seen mouse x position during a drag, in px from screen left side */
  @State() lastSeenAtX: number | null = null;

  /** Total x distance moved during a drag, in px */
  @State() movedX: number | null = null;

  /** Current widths of the three panes, in px */
  @State() leftPaneWidth = 0;
  @State() rightPaneWidth = 0;

  /**
   * Set element width on load
   */

  componentDidLoad() {
    // On initial load, attempt to get stored widths from sessionStorage.
    // Otherwise, measure the panes element and set side pane widths to default
    // percentages of its width, or the minimum width, whichever is larger.

    const el = document.querySelector('iot-resizable-panes');
    if (!el) return;

    const storedLeftWidthPercent = getStoredLeftWidthPercent();
    const storedRightWidthPercent = getStoredRightWidthPercent();
    const elementWidth = el.offsetWidth;

    if (storedLeftWidthPercent) {
      const storedLeftWidth = elementWidth * storedLeftWidthPercent;
      this.leftPaneWidth = storedLeftWidth;
    } else {
      const computedLeftPaneWidth = elementWidth * LEFT_WIDTH_PERCENT;
      this.leftPaneWidth =
        computedLeftPaneWidth > MINIMUM_SIDE_PANE_WIDTH ? computedLeftPaneWidth : MINIMUM_SIDE_PANE_WIDTH;
    }

    if (storedRightWidthPercent) {
      const storedRightWidth = elementWidth * storedRightWidthPercent;
      this.rightPaneWidth = storedRightWidth;
    } else {
      const computedRightPaneWidth = elementWidth * RIGHT_WIDTH_PERCENT;
      this.rightPaneWidth =
        computedRightPaneWidth > MINIMUM_SIDE_PANE_WIDTH ? computedRightPaneWidth : MINIMUM_SIDE_PANE_WIDTH;
    }
  }

  /**
   * Drag event handlers and methods
   */

  cancelDrag() {
    this.currentDragHandle = null;
    this.lastSeenAtX = null;
    this.movedX = null;
  }

  onHandleDragStart(event: MouseEvent) {
    const target = event.target;
    if (target instanceof Element) {
      if (target.classList && target.classList.contains('iot-resizable-panes-handle')) {
        this.lastSeenAtX = event.clientX;
        this.movedX = 0;
        if (target.classList.contains('iot-resizable-panes-handle-left')) {
          this.currentDragHandle = 'left';
        } else {
          this.currentDragHandle = 'right';
        }
      }
    }
  }

  onHandleDragMove(event: MouseEvent) {
    const el = document.querySelector('iot-resizable-panes');
    if (!el) return;
    const elementWidth = el.offsetWidth;

    if (!this.currentDragHandle || this.lastSeenAtX === null || this.movedX === null) return;

    this.movedX = -(this.lastSeenAtX - event.clientX);
    this.lastSeenAtX = event.clientX;

    if (this.currentDragHandle === 'left') {
      const nextLeftPaneWidth = this.leftPaneWidth + this.movedX;

      // Stop drag when dragged pane runs into other pane
      if (nextLeftPaneWidth + this.rightPaneWidth >= elementWidth - MINIMUM_CENTER_PANE_WIDTH) {
        this.cancelDrag();
        return;
      }

      // Persist percentage with sessionStorage
      this.leftPaneWidth = nextLeftPaneWidth;
      const nextLeftPaneWidthPercent = nextLeftPaneWidth / elementWidth;
      sessionStorage.setItem(LEFT_WIDTH_PERCENT_STORAGE_KEY, nextLeftPaneWidthPercent.toString());
    }

    if (this.currentDragHandle === 'right') {
      const nextRightPaneWidth = this.rightPaneWidth - this.movedX;

      // Stop drag when dragged pane runs into other pane
      if (nextRightPaneWidth + this.leftPaneWidth >= elementWidth - MINIMUM_CENTER_PANE_WIDTH) {
        this.cancelDrag();
        return;
      }

      // Persist percentage with sessionStorage
      this.rightPaneWidth = nextRightPaneWidth;
      const nextRightPaneWidthPercent = nextRightPaneWidth / elementWidth;
      sessionStorage.setItem(RIGHT_WIDTH_PERCENT_STORAGE_KEY, nextRightPaneWidthPercent.toString());
    }
  }

  onHandleDragEnd() {
    this.cancelDrag();
  }

  /**
   * Because the width of left/right panes is hardcoded, resizing the screen
   * to a smaller width can cause collisions. This method resizes side panes
   * proportionally when the screen is resized to prevent these collisions.
   */

  resizeSidePanes() {
    const totalBuffer = MINIMUM_CENTER_PANE_WIDTH + HANDLE_WIDTH * 2;
    const totalWidth = this.leftPaneWidth + this.rightPaneWidth + totalBuffer;
    const el = document.querySelector('iot-resizable-panes');
    if (!el) return;
    const elementWidth = el.offsetWidth;

    // Set next proportion for panes. If proportions added exceed a threshold,
    // scale them down until they do not.
    const leftProportion = this.leftPaneWidth / elementWidth;
    const rightProportion = this.rightPaneWidth / elementWidth;
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
    this.leftPaneWidth = nextLeftPaneWidth;
    this.rightPaneWidth = nextRightPaneWidth;
  }

  /**
   * Input bindings
   */

  @CustomEvent('dragstart')
  onDragStart(event: PointerEvent) {
    this.onHandleDragStart(event);
  }

  @CustomEvent('drag')
  onDrag(event: PointerEvent) {
    this.onHandleDragMove(event);
  }

  @CustomEvent('dragend')
  onDragEnd() {
    this.onHandleDragEnd();
  }

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.resizeSidePanes();
  }

  render() {
    return (
      <div class="iot-resizable-panes">
        <div
          class="iot-resizable-panes-pane iot-resizable-panes-pane-left"
          style={{ width: `${this.leftPaneWidth}px` }}
        >
          <slot name="left" />
        </div>

        <div
          class="iot-resizable-panes-handle iot-resizable-panes-handle-left"
          style={{ width: `${HANDLE_WIDTH}px` }}
          tabIndex={0}
        />

        <div class="iot-resizable-panes-pane iot-resizable-panes-pane-center">
          <slot name="center" />
        </div>

        <div
          class="iot-resizable-panes-handle iot-resizable-panes-handle-right"
          style={{ width: `${HANDLE_WIDTH}px` }}
          tabIndex={0}
        />

        <div
          class="iot-resizable-panes-pane iot-resizable-panes-pane-right"
          style={{ width: `${this.rightPaneWidth}px` }}
        >
          <slot name="right" />
        </div>
      </div>
    );
  }
}
