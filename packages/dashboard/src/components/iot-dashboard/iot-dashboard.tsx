import { Component, h, Listen, State, Prop, Watch, Element } from '@stencil/core';
import { Position, Rect, DashboardConfiguration, OnResize, Anchor } from '../../types';
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
  /** The configurations which determines which widgets render where with what settings. */
  @Prop() dashboardConfiguration: DashboardConfiguration;

  /**
   * Callback that is fired every time the dashboard configuration has been altered.
   *
   * When a widget is moved, resized, deleted, appended, or altered, then this method is called
   */
  @Prop() onDashboardConfigurationChange: (config: DashboardConfiguration) => void;

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

  /** List of ID's of the currently selected widgets. */
  @State() selectedWidgetIds: string[] = [];

  /** The dashboard configurations current state. This is what the dashboard reflects as truth. */
  @State() currDashboardConfiguration: DashboardConfiguration;
  @State() intermediateDashboardConfiguration: DashboardConfiguration | undefined = undefined;

  /** Selection gesture */
  @State() start: Position | undefined;
  @State() end: Position | undefined;
  @State() finishedSelecting: boolean = false;
  @State() previousPosition: Position | undefined;

  /** The currently active gesture */
  @State() activeGesture: 'move' | 'resize' | undefined;
  /** If the active gesture is resize, this represents which anchor point the resize is being done relative to */
  @State() activeResizeAnchor: Anchor | undefined;
  /** The initial position of the cursor on the start of the resize gesture */
  @State() resizeStartPosition: Position | undefined;

  @State() currWidth: number;
  @Element() el!: HTMLElement;

  private resizer: ResizeObserver;

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
  watchDashboardConfiguration(newDashboardConfiguration: DashboardConfiguration) {
    this.currDashboardConfiguration = newDashboardConfiguration;
  }

  onMoveStart({ x, y }: Position) {
    this.activeGesture = 'move';
    const intersectedWidgetIds = getSelectedWidgetIds({
      selectedRect: { x, y, width: 1, height: 1 },
      dashboardConfiguration: this.currDashboardConfiguration,
      cellSize: this.actualCellSize(),
    });

    const selectingAlreadySelectedWidget = intersectedWidgetIds.some((widgetId) =>
      this.selectedWidgetIds.includes(widgetId)
    );

    if (!selectingAlreadySelectedWidget) {
      this.setSelectedWidgets();
    }

    if (intersectedWidgetIds.length === 0) {
      // start new selection
      this.start = { x, y };
      this.finishedSelecting = false;
    } else {
      // Begin moving widgets selected
      this.previousPosition = { x, y };
      if (this.selectedWidgetIds.length === 0) {
        this.selectedWidgetIds = intersectedWidgetIds;
      }
    }
  }

  setDashboardConfiguration(dashboardConfiguration: DashboardConfiguration) {
    this.currDashboardConfiguration = dashboardConfiguration;
    this.onDashboardConfigurationChange(this.currDashboardConfiguration);
  }

  /**
   * Moves one or more selected widgets
   */
  moveWidgets(position: Position) {
    this.setDashboardConfiguration(
      getMovedDashboardConfiguration({
        dashboardConfiguration: this.currDashboardConfiguration,
        position,
        previousPosition: this.previousPosition,
        selectedWidgetIds: this.selectedWidgetIds,
        cellSize: this.actualCellSize(),
      })
    );
  }

  onMove({ x, y }: Position) {
    if (this.previousPosition) {
      /** is moving widgets */
      this.moveWidgets({ x, y });
      this.previousPosition = { x, y };
    } else if (!this.finishedSelecting) {
      /** is selecting */
      this.end = { x, y };
      this.setSelectedWidgets();
    }
  }

  onEnd({ x, y }: Position) {
    if (this.activeGesture === 'move') {
      /**
       * End Move
       */
      this.previousPosition = undefined;
      this.end = { x, y };
      this.finishedSelecting = true;
      this.start = undefined;
      this.end = undefined;
      this.setDashboardConfiguration(this.currDashboardConfiguration.map(trimWidgetPosition));
    } else if (this.activeGesture === 'resize' && this.intermediateDashboardConfiguration) {
      /**
       * End Resize
       */
      this.setDashboardConfiguration(this.intermediateDashboardConfiguration.map(trimWidgetPosition));
      this.intermediateDashboardConfiguration = undefined;
      this.activeResizeAnchor = undefined;
    }

    this.activeGesture = undefined;
  }

  /**
   * Mouse and keyboard bindings
   */

  @Listen('mousedown')
  onMouseDown(event: MouseEvent) {
    this.onMoveStart(getDashboardPosition(event));
  }

  @Listen('mousemove')
  onMouseMove(event: MouseEvent) {
    if (this.activeGesture === 'move') {
      this.onMove(getDashboardPosition(event));
    } else if (this.activeGesture === 'resize') {
      this.onResize(event);
    }
  }

  @Listen('mouseup')
  onMouseUp(event: MouseEvent) {
    this.onEnd(getDashboardPosition(event));
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

  onResizeStart: OnResize = ({ anchor, currentPosition }) => {
    this.activeGesture = 'resize';
    this.activeResizeAnchor = anchor;
    this.resizeStartPosition = currentPosition;
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

  getDashboardConfiguration = (): DashboardConfiguration => {
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
          gridTemplateColumns: `repeat(${numColumns}, ${cellSize}px)`,
          gridAutoRows: `${cellSize}px`,
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

        {!this.finishedSelecting && rect && (
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
