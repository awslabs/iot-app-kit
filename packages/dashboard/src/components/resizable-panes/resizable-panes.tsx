import { Component, State, Listen, h } from '@stencil/core';

const HANDLE_WIDTH_PX = 10;
const LEFT_WIDTH_PERCENT = 0.15;
const CENTER_WIDTH_PERCENT = 0.7;
const RIGHT_WIDTH_PERCENT = 0.15;

@Component({
  tag: 'resizable-panes',
  styleUrl: 'resizable-panes.css',
})
export class ResizablePanes {
  /** Currently active drag hangle during a drag, or null if not dragging */
  @State() currentDragHandle: 'left' | 'right' | null = null;

  /** Last seen mouse x position during a drag, in px from screen left side */
  @State() lastSeenAtX: number | null = null;

  /** Total x distance moved during a drag, in px */
  @State() movedX: number | null = null;

  /** Current widths of the three panes, in percentage of screen width */
  @State() leftPaneWidth: number = window.innerWidth * LEFT_WIDTH_PERCENT;
  @State() centerPaneWidth: number = window.innerWidth * CENTER_WIDTH_PERCENT;
  @State() rightPaneWidth: number = window.innerWidth * RIGHT_WIDTH_PERCENT;

  /**
   * Drag event handlers
   */

  onHandleDragStart(event: MouseEvent) {
    const target = event.target;
    if (target instanceof Element) {
      if (target.classList && target.classList.contains('resizable-panes-handle')) {
        this.lastSeenAtX = event.clientX;
        this.movedX = 0;
        if (target.classList.contains('resizable-panes-handle-left')) {
          this.currentDragHandle = 'left';
        } else {
          this.currentDragHandle = 'right';
        }
      }
    }
  }

  onHandleDragMove(event: MouseEvent) {
    if (!this.currentDragHandle || this.lastSeenAtX === null || this.movedX === null) return;
    this.movedX = -(this.lastSeenAtX - event.clientX);
    this.lastSeenAtX = event.clientX;
    if (this.currentDragHandle === 'right') {
      this.centerPaneWidth = this.centerPaneWidth + this.movedX;
      this.rightPaneWidth = this.rightPaneWidth - this.movedX;
    }
    if (this.currentDragHandle === 'left') {
      this.centerPaneWidth = this.centerPaneWidth - this.movedX;
      this.leftPaneWidth = this.leftPaneWidth + this.movedX;
    }
  }

  onHandleDragEnd() {
    this.currentDragHandle = null;
    this.lastSeenAtX = null;
    this.movedX = null;
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
    const compensate = (value: number) => Math.floor(value - handleWidthCompensation);
    const handleWidthCompensation = Math.floor((HANDLE_WIDTH_PX * 2) / 3 + 4);
    const gridTemplateColumns = `${compensate(this.leftPaneWidth)}px ${HANDLE_WIDTH_PX}px ${compensate(
      this.centerPaneWidth
    )}px ${HANDLE_WIDTH_PX}px ${compensate(this.rightPaneWidth)}px`;

    return (
      <div class="resizable-panes" style={{ gridTemplateColumns }}>
        <div class="resizable-panes-pane resizable-panes-pane-left">
          <slot name="left" />
        </div>
        <div class="resizable-panes-handle resizable-panes-handle-left" />
        <div class="resizable-panes-pane resizable-panes-pane-center">
          <slot name="center" />
        </div>
        <div class="resizable-panes-handle resizable-panes-handle-right" />
        <div class="resizable-panes-pane resizable-panes-pane-right">
          <slot name="right" />
        </div>
      </div>
    );
  }
}
