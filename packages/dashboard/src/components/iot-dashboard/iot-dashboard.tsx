import { Component, h, Listen, State, Prop, Watch, Element, EventEmitter, Event } from '@stencil/core';
import { Position, Rect, Widgets, OnResize, Anchor, MoveActionInput, ResizeActionInput } from '../../types';
import { getSelectedWidgetIds } from '../../dashboard-actions/select';
import ResizeObserver from 'resize-observer-polyfill';
import { resize } from '../../dashboard-actions/resize';
import { getMovedDashboardConfiguration } from '../../dashboard-actions/move';
import { getSelectionBox } from './getSelectionBox';
import { DASHBOARD_CONTAINER_ID, getDashboardPosition } from './getDashboardPosition';
import { trimWidgetPosition } from './trimWidgetPosition';

const DEFAULT_STRETCH_TO_FIT = true;
const DEFAULT_CELL_SIZE = 15;

@Component({
  tag: 'iot-dashboard',
  styleUrl: 'iot-dashboard.css',
  shadow: false,
})
export class IotDashboard {
  private resizer: ResizeObserver;

  /** The configurations which determines which widgets render where with what settings. */
  @Prop() dashboardConfiguration: Widgets;

  /**
   * Callback that is fired every time the dashboard configuration has been altered.
   *
   * When a widget is moved, resized, deleted, appended, or altered, then this method is called
   */
  @Prop() onDashboardConfigurationChange?: (config: Widgets) => void;

  /**
   * Whether the dashboard grid will stretch to fit.
   *
   * If stretch to fit is false, the dashboard grid will be the width in pixels.
   * If not enough room is present, it will utilize scrollbars to allow access to the entire grid.
   *
   * If stretch to fit is true, the entire grid will scale proportionally to scale to the available space for the grid.
   */
  @Prop() stretchToFit: Boolean = DEFAULT_STRETCH_TO_FIT;

  /** Width of the dashboard, in pixels */
  @Prop() width: number;

  /** Width and height of the cell, in pixels */
  @Prop() cellSize: number = DEFAULT_CELL_SIZE;
  @Prop() move: (moveInput: MoveActionInput) => void;

  @Prop() resizeWidgets: (resizeInput: ResizeActionInput) => void;
  /** List of ID's of the currently selected widgets. */
  @State() selectedWidgetIds: string[] = [];

  @State() currWidth: number;
  @Element() el!: HTMLElement;

  /** The dashboard configurations current state. This is what the dashboard reflects as truth. */
  @State() currDashboardConfiguration: Widgets;
  @State() intermediateDashboardConfiguration: Widgets | undefined = undefined;

  /** The currently active gesture */
  @State() activeGesture: 'move' | 'resize' | 'selection' | undefined;

  /**
   * Selection gesture
   */

  @State() start: Position | undefined;
  @State() end: Position | undefined;

  /**
   * Move gesture
   */

  @State() previousPosition: Position | undefined;

  /**
   * Resize gesture
   */

  /** If the active gesture is resize, this represents which anchor point the resize is being done relative to */
  @State() activeResizeAnchor: Anchor | undefined;
  /** The initial position of the cursor on the start of the resize gesture */
  @State() resizeStartPosition: Position | undefined;

  componentWillLoad() {
    this.currDashboardConfiguration = this.dashboardConfiguration;

    /**
     * Creates a listener for elements dimensions changing.
     * This allows us to dynamically set the widget dimensions.
     */
    this.resizer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        /** Update Size */
        const { width } = entry.contentRect;
        this.currWidth = width;
      });
    });

    this.currWidth = this.width;
  }

  componentDidLoad() {
    this.resizer.observe(this.el.firstElementChild as Element);
  }

  @Watch('dashboardConfiguration')
  watchDashboardConfiguration(newDashboardConfiguration: Widgets) {
    this.currDashboardConfiguration = newDashboardConfiguration;
  }

  isPositionOnWidget = ({ x, y }: Position): boolean => {
    const intersectedWidgetIds = getSelectedWidgetIds({
      selectedRect: { x, y, width: 1, height: 1 },
      dashboardConfiguration: this.currDashboardConfiguration,
      cellSize: this.actualCellSize(),
    });
    return intersectedWidgetIds.length !== 0;
  };

  setDashboardConfiguration(dashboardConfiguration: Widgets) {
    this.currDashboardConfiguration = dashboardConfiguration;
    if (this.onDashboardConfigurationChange) {
      this.onDashboardConfigurationChange(this.currDashboardConfiguration);
    }
  }

  /**
   *
   * Gesture Start
   *
   */

  onGestureStart(event: MouseEvent) {
    const { x, y } = getDashboardPosition(event);
    const isMoveGesture = !event.shiftKey && this.isPositionOnWidget({ x, y });

    if (isMoveGesture) {
      this.onMoveStart({ x, y });
    } else {
      this.onSelectionStart(event);
    }
    // NOTE: Resize is initiated within the `<iot-selection-box />`
  }

  onSelectionStart(event: MouseEvent) {
    this.activeGesture = 'selection';

    const { x, y } = getDashboardPosition(event);
    this.start = { x, y };
    this.end = { x, y };

    const isUnionSelection = event.shiftKey;
    const intersectedWidgetIds = getSelectedWidgetIds({
      selectedRect: this.selectedRect(),
      dashboardConfiguration: this.getDashboardConfiguration(),
      cellSize: this.actualCellSize(),
    });

    const newlySelectedWidgetIds = intersectedWidgetIds.filter((id) => !this.selectedWidgetIds.includes(id));
    this.selectedWidgetIds = isUnionSelection
      ? [...this.selectedWidgetIds, ...newlySelectedWidgetIds]
      : intersectedWidgetIds;
  }

  onResizeStart: OnResize = ({ anchor, currentPosition }) => {
    this.activeGesture = 'resize';

    this.activeResizeAnchor = anchor;
    this.resizeStartPosition = currentPosition;
  };

  onMoveStart({ x, y }: Position) {
    this.activeGesture = 'move';

    const intersectedWidgetIds = getSelectedWidgetIds({
      selectedRect: { x, y, width: 1, height: 1 },
      dashboardConfiguration: this.getDashboardConfiguration(),
      cellSize: this.actualCellSize(),
    });

    const selectingAlreadySelectedWidget = intersectedWidgetIds.some((widgetId) =>
      this.selectedWidgetIds.includes(widgetId)
    );

    if (!selectingAlreadySelectedWidget) {
      this.setSelectedWidgets();
    }

    this.previousPosition = { x, y };
    if (this.selectedWidgetIds.length === 0) {
      this.selectedWidgetIds = intersectedWidgetIds;
    }
  }

  /**
   *
   * On gesture update
   *
   */

  onGestureUpdate(event: MouseEvent) {
    if (this.activeGesture === 'move') {
      this.onMove(getDashboardPosition(event));
    } else if (this.activeGesture === 'resize') {
      this.onResize(event);
    } else if (this.activeGesture === 'selection') {
      this.onSelection(event);
    }
  }

  onMove({ x, y }: Position) {
    if (this.previousPosition) {
      this.setDashboardConfiguration(
        getMovedDashboardConfiguration({
          dashboardConfiguration: this.currDashboardConfiguration,
          position: { x, y },
          previousPosition: this.previousPosition,
          selectedWidgetIds: this.selectedWidgetIds,
          cellSize: this.actualCellSize(),
        })
      );
      this.previousPosition = { x, y };
    }
  }

  onSelection = (event: MouseEvent) => {
    const isUnionSelection = event.shiftKey;

    this.end = getDashboardPosition(event);
    const intersectedWidgetIds = getSelectedWidgetIds({
      selectedRect: this.selectedRect(),
      dashboardConfiguration: this.getDashboardConfiguration(),
      cellSize: this.actualCellSize(),
    });

    const newlySelectedWidgetIds = intersectedWidgetIds.filter((id) => !this.selectedWidgetIds.includes(id));
    this.selectedWidgetIds = isUnionSelection
      ? [...this.selectedWidgetIds, ...newlySelectedWidgetIds]
      : intersectedWidgetIds;
  };

  onResize = (event: MouseEvent) => {
    if (this.activeResizeAnchor && this.resizeStartPosition) {
      this.intermediateDashboardConfiguration = resize({
        anchor: this.activeResizeAnchor,
        changeInPosition: {
          x: event.clientX - this.resizeStartPosition.x,
          y: event.clientY - this.resizeStartPosition.y,
        },
        cellSize: this.actualCellSize(),
        dashboardConfiguration: this.currDashboardConfiguration,
        widgetIds: this.selectedWidgetIds,
      });
    }
  };

  /**
   * On end of gesture
   */

  onGestureEnd() {
    if (this.activeGesture === 'move') {
      this.onMoveEnd();
    } else if (this.activeGesture === 'resize') {
      this.onResizeEnd();
    } else if (this.activeGesture === 'selection') {
      this.onSelectionEnd();
    }
  }

  onMoveEnd() {
    this.snapWidgetsToGrid();
    this.previousPosition = undefined;
    this.activeGesture = undefined;
  }

  onResizeEnd() {
    this.snapWidgetsToGrid();
    this.intermediateDashboardConfiguration = undefined;
    this.activeResizeAnchor = undefined;
    this.activeGesture = undefined;
  }

  onSelectionEnd() {
    // Clear selection
    this.start = undefined;
    this.end = undefined;

    this.activeGesture = undefined;
  }

  /**
   * Input bindings
   */

  @Listen('mousedown')
  onMouseDown(event: MouseEvent) {
    this.onGestureStart(event);
  }

  @Listen('mousemove')
  onMouseMove(event: MouseEvent) {
    this.onGestureUpdate(event);
  }

  @Listen('mouseup')
  onMouseUp() {
    this.onGestureEnd();
  }

  /**
   * Set which widgets are selected
   */
  setSelectedWidgets() {
    this.selectedWidgetIds = getSelectedWidgetIds({
      selectedRect: this.selectedRect(),
      cellSize: this.actualCellSize(),
      dashboardConfiguration: this.currDashboardConfiguration,
    });
  }

  snapWidgetsToGrid() {
    this.setDashboardConfiguration(this.getDashboardConfiguration().map(trimWidgetPosition));
  }

  /**
   * Return the currently selected rectangle
   */
  selectedRect = (): Rect | undefined => {
    if (!this.start || !this.end) {
      return undefined;
    }
    return {
      x: Math.min(this.start.x, this.end.x),
      y: Math.min(this.start.y, this.end.y),
      width: Math.abs(this.start.x - this.end.x),
      height: Math.abs(this.start.y - this.end.y),
    };
  };

  /**
   * Returns the cell size with any stretching / shrinking of the dashboard applied.
   */
  actualCellSize = () => {
    const scale = this.stretchToFit ? this.currWidth / this.width : 1;
    return scale * this.cellSize;
  };

  getDashboardConfiguration = (): Widgets => {
    return this.intermediateDashboardConfiguration || this.currDashboardConfiguration;
  };

  render() {
    const dashboardConfiguration = this.getDashboardConfiguration();
    const numColumns = Math.round(this.width / this.cellSize);
    const cellSize = this.actualCellSize();

    const rect = this.selectedRect();
    const selectionBox = getSelectionBox({
      selectedWidgetIds: this.selectedWidgetIds,
      dashboardConfiguration,
    });
    return (
      <div
        id={DASHBOARD_CONTAINER_ID}
        class="container"
        style={{
          width: this.stretchToFit ? '100%' : `${this.width}px`,
        }}
      >
        {dashboardConfiguration.map((widget) => (
          <iot-dashboard-widget
            isSelected={this.selectedWidgetIds.includes(widget.id)}
            key={widget.id}
            cellSize={this.actualCellSize()}
            widget={widget}
          />
        ))}

        {selectionBox != null && (
          <iot-selection-box
            onResize={this.onResizeStart}
            cellSize={this.actualCellSize()}
            x={selectionBox.x}
            y={selectionBox.y}
            height={selectionBox.height}
            width={selectionBox.width}
          />
        )}

        {<div class="grid-image" style={{ backgroundSize: `${cellSize}px` }} />}

        {this.activeGesture === 'selection' && rect && (
          <div
            class="select-rect"
            style={{
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
            }}
          ></div>
        )}
      </div>
    );
  }
}
