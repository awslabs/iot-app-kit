import { Component, h, Listen, State, Prop, Watch, Element } from '@stencil/core';
import {
  Position,
  Rect,
  DashboardConfiguration,
  ResizeActionInput,
  OnResize,
  Anchor,
  MoveActionInput,
  Widget,
  DeleteActionInput,
  PasteActionInput,
  CopyActionInput,
} from '../../types';
import { getSelectedWidgetIds } from '../../util/select';
import ResizeObserver from 'resize-observer-polyfill';
import { getSelectionBox } from './getSelectionBox';
import { DASHBOARD_CONTAINER_ID, getDashboardPosition } from './getDashboardPosition';

const DEFAULT_STRETCH_TO_FIT = true;
const DEFAULT_CELL_SIZE = 15;

@Component({
  tag: 'iot-dashboard-internal',
  styleUrl: 'iot-dashboard-internal.css',
  shadow: false,
})
export class IotDashboard {
  private resizer: ResizeObserver;

  /** The configurations which determines which widgets render where with what settings. */
  @Prop() dashboardConfiguration: DashboardConfiguration;

  /**
   * Callback that is fired every time the dashboard configuration has been altered.
   *
   * When a widget is moved, resized, deleted, appended, or altered, then this method is called
   */
  @Prop() onDashboardConfigurationChange?: (config: DashboardConfiguration) => void;

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
  @Prop() moveWidgets: (moveInput: MoveActionInput) => void;

  @Prop() resizeWidgets: (resizeInput: ResizeActionInput) => void;
  @Prop() midResize: (resizeInput: ResizeActionInput) => void;

  @Prop() deleteWidgets: (deleteInput: DeleteActionInput) => void;

  @Prop() pasteWidgets: () => void;
  @Prop() copyWidgets: (copyInput: CopyActionInput) => void;

  @Prop() undo: () => void;
  @Prop() redo: () => void;

  @State() startMove: Position;
  @State() endMove: Position;

  @State() startResize: Position;
  @State() endResize: Position;

  /** List of ID's of the currently selected widgets. */
  @State() selectedWidgetIds: string[] = [];

  @State() currWidth: number;
  @Element() el!: HTMLElement;

  /** The dashboard configurations current state. This is what the dashboard reflects as truth. */
  @State() currDashboardConfiguration: DashboardConfiguration;
  @State() intermediateDashboardConfiguration: DashboardConfiguration | undefined = undefined;

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
  watchDashboardConfiguration(newDashboardConfiguration: DashboardConfiguration) {
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

  setDashboardConfiguration(dashboardConfiguration: DashboardConfiguration) {
    this.currDashboardConfiguration = dashboardConfiguration;
    if (this.onDashboardConfigurationChange) {
      this.onDashboardConfigurationChange(this.currDashboardConfiguration);
    }
  }

  onDelete() {
    this.deleteWidgets({
      widgetIds: this.selectedWidgetIds,
      widgets: this.currDashboardConfiguration.widgets.filter(({ id }) => this.selectedWidgetIds.includes(id)),
    });
  }

  onCopy() {
    this.copyWidgets({
      copyGroup: this.dashboardConfiguration.widgets.filter(({ id }) => this.selectedWidgetIds.includes(id)),
    });
  }

  onPaste() {
    const existingWidgetIds = this.getDashboardConfiguration().widgets.map(({ id }) => id);
    this.pasteWidgets();
    // Set the selection group to the newly pasted group of widgets
    const newlyCreatedWidgetIds = this.getDashboardConfiguration()
      .widgets.filter(({ id }) => !existingWidgetIds.includes(id))
      .map(({ id }) => id);
    this.selectedWidgetIds = newlyCreatedWidgetIds;
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
    this.startResize = currentPosition;
  };

  onMoveStart({ x, y }: Position) {
    this.activeGesture = 'move';
    this.startMove = { x, y };
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
      this.moveWidgets({
        position: { x, y },
        prevPosition: this.previousPosition,
        widgetIds: this.selectedWidgetIds,
        cellSize: this.actualCellSize(),
      });

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
      this.midResize({
        anchor: this.activeResizeAnchor,
        changeInPosition: {
          x: event.clientX - this.resizeStartPosition.x,
          y: event.clientY - this.resizeStartPosition.y,
        },
        cellSize: this.actualCellSize(),
        dashboardConfiguration: this.dashboardConfiguration,
        widgetIds: this.selectedWidgetIds,
      });
      let tempPos: Position = { x: event.clientX, y: event.clientY };
      this.endResize = tempPos;
    }
  };

  /**
   * On end of gesture
   */

  onGestureEnd({ x, y }: Position) {
    if (this.activeGesture === 'move') {
      this.onMoveEnd({ x, y });
    } else if (this.activeGesture === 'resize') {
      this.onResizeEnd({ x, y });
    } else if (this.activeGesture === 'selection') {
      this.onSelectionEnd();
    }
  }

  onMoveEnd({ x, y }: Position) {
    this.endMove = { x, y };
    this.move({
      position: this.endMove,
      prevPosition: this.startMove,
      widgetIds: this.selectedWidgetIds,
      cellSize: this.actualCellSize(),
    });

    this.previousPosition = undefined;
    this.activeGesture = undefined;
  }

  onResizeEnd({ x, y }: Position) {
    if (this.activeResizeAnchor) {
      this.resizeWidgets({
        anchor: this.activeResizeAnchor,
        changeInPosition: {
          x: this.endResize.x - this.startResize.x,
          y: this.endResize.y - this.startResize.y,
        },
        cellSize: this.actualCellSize(),
        widgetIds: this.selectedWidgetIds,
        dashboardConfiguration: this.dashboardConfiguration,
      });
    }

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
  onMouseUp(event: MouseEvent) {
    this.onGestureEnd(getDashboardPosition(event));
  }

  @Listen('keydown')
  onKeyDown({ key, ctrlKey, metaKey, shiftKey }: KeyboardEvent) {
    /** Delete action */
    const isDeleteAction = key === 'Backspace' || key === 'Delete';
    if (isDeleteAction) {
      this.onDelete();
      return;
    }

    /** Copy action */
    const isCopyAction = (ctrlKey || metaKey) && key === 'c';
    if (isCopyAction) {
      this.onCopy();
      return;
    }

    /** Paste action */
    const isPasteAction = (ctrlKey || metaKey) && key === 'v';
    if (isPasteAction) {
      this.onPaste();
      return;
    }

    /** Undo action */
    const isUndoAction = (ctrlKey || metaKey) && key === 'z';
    if (isUndoAction) {
      this.undo();
      return;
    }

    /** Redo action */
    const isRedoAction = (ctrlKey || metaKey) && shiftKey && key == 'z';
    if (isRedoAction) {
      this.redo();
      return;
    }
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

  getDashboardConfiguration = (): DashboardConfiguration => {
    return this.intermediateDashboardConfiguration || this.currDashboardConfiguration;
  };

  render() {
    const dashboardConfiguration = this.getDashboardConfiguration();
    const cellSize = this.actualCellSize();

    const rect = this.selectedRect();
    const selectionBox = getSelectionBox({
      selectedWidgetIds: this.selectedWidgetIds,
      dashboardConfiguration,
    });
    return (
      <div
        id={DASHBOARD_CONTAINER_ID}
        tabIndex={0}
        class="container"
        style={{
          width: this.stretchToFit ? '100%' : `${this.width}px`,
        }}
      >
        {dashboardConfiguration.widgets.map((widget) => (
          <iot-dashboard-widget
            isSelected={this.selectedWidgetIds.includes(widget.id)}
            isMoving={this.activeGesture === 'move' && this.selectedWidgetIds.includes(widget.id)}
            key={widget.id}
            cellSize={this.actualCellSize()}
            widget={widget}
            viewport={this.dashboardConfiguration.viewport}
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
