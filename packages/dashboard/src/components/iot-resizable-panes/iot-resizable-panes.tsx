import { Component, State, Listen, h } from '@stencil/core';

const LEFT_WIDTH_PERCENT = 0.15;
const RIGHT_WIDTH_PERCENT = 0.15;
const CENTER_BUFFER = 50;

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

  /** Current widths of the three panes, in percentage of parent width */
  @State() leftPaneWidth = 0;
  @State() rightPaneWidth = 0;

  /**
   * Set element width on load
   */

  componentDidLoad() {
    const el = document.querySelector('iot-resizable-panes');
    if (!el) return;
    const elementWidth = el.offsetWidth;
    this.leftPaneWidth = elementWidth * LEFT_WIDTH_PERCENT;
    this.rightPaneWidth = elementWidth * RIGHT_WIDTH_PERCENT;
  }

  cancelDrag() {
    this.currentDragHandle = null;
    this.lastSeenAtX = null;
    this.movedX = null;
  }

  /**
   * Drag event handlers
   */

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

    if (this.currentDragHandle === 'right') {
      const nextRightPaneWidth = this.rightPaneWidth - this.movedX;
      // Stop drag when pane runs into other pane
      if (nextRightPaneWidth + this.leftPaneWidth >= elementWidth - CENTER_BUFFER) {
        this.cancelDrag();
        return;
      }
      this.rightPaneWidth = nextRightPaneWidth;
    }

    if (this.currentDragHandle === 'left') {
      const nextLeftPaneWidth = this.leftPaneWidth + this.movedX;
      // Stop drag when pane runs into other pane
      if (nextLeftPaneWidth + this.rightPaneWidth >= elementWidth - CENTER_BUFFER) {
        this.cancelDrag();
        return;
      }
      this.leftPaneWidth = nextLeftPaneWidth;
    }
  }

  onHandleDragEnd() {
    this.cancelDrag();
  }

  /**
   * Input bindings
   */

  @Listen('mousedown')
  onMouseDown(event: MouseEvent) {
    this.onHandleDragStart(event);
  }

  @Listen('mousemove')
  onMouseMove(event: MouseEvent) {
    this.onHandleDragMove(event);
  }

  @Listen('mouseup')
  onMouseUp() {
    this.onHandleDragEnd();
  }

  render() {
    return (
      <div class="iot-resizable-panes">
        <div
          class="iot-resizable-panes-pane iot-resizable-panes-pane-left"
          style={{ width: this.leftPaneWidth.toString() + 'px' }}
        >
          <slot name="left" />
        </div>
        <div class="iot-resizable-panes-handle iot-resizable-panes-handle-left" />
        <div class="iot-resizable-panes-pane iot-resizable-panes-pane-center">
          <slot name="center" />
        </div>
        <div class="iot-resizable-panes-handle iot-resizable-panes-handle-right"></div>
        <div
          class="iot-resizable-panes-pane iot-resizable-panes-pane-right"
          style={{ width: this.rightPaneWidth.toString() + 'px' }}
        >
          <slot name="right" />
        </div>
      </div>
    );
  }
}
