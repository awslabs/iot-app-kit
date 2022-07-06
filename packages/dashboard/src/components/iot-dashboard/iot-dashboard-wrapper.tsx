import { Component, h, State, Prop } from '@stencil/core';
import { createStore } from 'redux';
import {
  DashboardStore,
  DashboardConfiguration,
  MoveActionInput,
  Position,
  Anchor,
  ResizeActionInput,
  onResizeAction,
  onDeleteAction,
  DeleteActionInput,
  PasteActionInput,
  onPasteAction,
} from '../../types';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { onMoveAction } from '../../dashboard-actions/actions';
import { getMovedDashboardConfiguration } from '../../dashboard-actions/move';
import { resize } from '../../dashboard-actions/resize';
import { trimWidgetPosition } from './trimWidgetPosition';

const DEFAULT_STRETCH_TO_FIT = true;
const DEFAULT_CELL_SIZE = 15;

@Component({
  tag: 'iot-dashboard-wrapper',
  shadow: false,
})
export class IotDashboardWrapper {
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
   */
  @Prop() stretchToFit: Boolean = DEFAULT_STRETCH_TO_FIT;

  /** Width of the dashboard, in pixels */
  @Prop() width: number;

  /** Width and height of the cell, in pixels */
  @Prop() cellSize: number = DEFAULT_CELL_SIZE;

  @State() dashboardLayout: DashboardConfiguration;

  /** Selection gesture */
  @State() start: Position | undefined;
  @State() end: Position | undefined;
  @State() finishedSelecting: boolean = false;
  @State() previousPosition: Position | undefined;

  /** List of ID's of the currently selected widgets. */
  @State() selectedWidgetIds: string[] = [];

  @State() currWidth: number;

  @State() intermediateLayout: DashboardConfiguration | undefined;

  /** The currently active gesture */
  @State() activeGesture: 'move' | 'resize' | undefined;
  /** If the active gesture is resize, this represents which anchor point the resize is being done relative to */
  @State() activeResizeAnchor: Anchor | undefined;
  /** The initial position of the cursor on the start of the resize gesture */
  @State() resizeStartPosition: Position | undefined;

  actualCellSize = () => {
    const scale = this.stretchToFit ? this.currWidth / this.width : 1;
    return scale * this.cellSize;
  };

  move(moveInput: MoveActionInput) {
    this.store.dispatch(onMoveAction(moveInput));
    this.previousPosition = moveInput.position;
    //console.log("layout after move ", this.dashboardLayout);
    //this.snapWidgetsToGrid();
  }
  moveWidgets(moveInput: MoveActionInput) {
    this.dashboardLayout = getMovedDashboardConfiguration({
      dashboardConfiguration: this.dashboardLayout,
      position: moveInput.position,
      previousPosition: moveInput.prevPosition,
      selectedWidgetIds: moveInput.widgetIds,
      cellSize: moveInput.cellSize,
    });
  }
  midResize(resizeInput: ResizeActionInput) {
    this.intermediateLayout = resize({
      anchor: resizeInput.anchor,
      changeInPosition: resizeInput.changeInPosition,
      widgetIds: resizeInput.widgetIds,
      cellSize: resizeInput.cellSize,
      dashboardConfiguration: this.dashboardLayout,
    });
  }
  resize(resizeInput: ResizeActionInput) {
    this.store.dispatch(onResizeAction(resizeInput));
    this.intermediateLayout = undefined;
    this.snapWidgetsToGrid();
  }

  deleteWidgets(deleteInput: DeleteActionInput) {
    this.store.dispatch(onDeleteAction(deleteInput));
  }

  pasteWidgets(pasteInput: PasteActionInput) {
    this.store.dispatch(onPasteAction(pasteInput));
  }

  store: DashboardStore;
  componentWillLoad() {
    this.store = createStore(dashboardReducer, this.dashboardConfiguration);
    this.store.subscribe(() => {
      this.dashboardLayout = this.store.getState();
    });
    this.dashboardLayout = this.dashboardConfiguration;
  }

  snapWidgetsToGrid() {
    this.dashboardLayout = this.dashboardLayout.map(trimWidgetPosition);
  }

  render() {
    return (
      this.dashboardLayout && (
        <div>
          <iot-dashboard
            width={this.width}
            cellSize={this.cellSize}
            stretchToFit={this.stretchToFit}
            dashboardConfiguration={this.intermediateLayout || this.dashboardLayout}
            onDashboardConfigurationChange={(newConfig) => {
              this.dashboardConfiguration = newConfig;
            }}
            move={(input) => this.move(input)}
            moveWidgets={(input) => this.moveWidgets(input)}
            resizeWidgets={(input) => this.resize(input)}
            midResize={(input) => this.midResize(input)}
            deleteWidgets={(input) => this.deleteWidgets(input)}
            pasteWidgets={(input) => this.pasteWidgets(input)}
          />
        </div>
      )
    );
  }
}
