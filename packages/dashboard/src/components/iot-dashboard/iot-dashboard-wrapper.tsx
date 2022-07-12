import { Component, h, State, Prop, Watch } from '@stencil/core';
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
  onCreateAction,
  CreateAction,
  UndoQueue,
  DashboardAction,
  onUndoAction,
  UndoAction,
  VoidAction,
  onVoidAction,
  RedoAction,
  onRedoAction,
  CreateActionInput,
} from '../../types';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { MoveAction, onMoveAction } from '../../dashboard-actions/actions';
import { getMovedDashboardConfiguration } from '../../dashboard-actions/move';
import { resize } from '../../dashboard-actions/resize';
import { trimWidgetPosition } from './trimWidgetPosition';
import { undo } from '../../dashboard-actions/undo';
import { reverseMove } from '../../dashboard-actions/reverse-actions/reverseMove';
import { create, reverse } from 'lodash';
import { reverseResize } from '../../dashboard-actions/reverse-actions/reverseResize';

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

  @Prop() addWidget: () => void;

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

  @State() undoQueue: UndoQueue = [];
  @State() redoQueue: UndoQueue = [];

  actualCellSize = () => {
    const scale = this.stretchToFit ? this.currWidth / this.width : 1;
    return scale * this.cellSize;
  };

  move(moveInput: MoveActionInput) {
    this.store.dispatch(onMoveAction(moveInput));
    this.previousPosition = moveInput.position;
    this.undoQueue.push(onMoveAction(moveInput));
    this.redoQueue = [];
  }
  moveWidgets(moveInput: MoveActionInput) {
    this.dashboardLayout = getMovedDashboardConfiguration({
      dashboardConfiguration: this.dashboardConfiguration,
      position: moveInput.position,
      previousPosition: moveInput.prevPosition,
      selectedWidgetIds: moveInput.widgetIds,
      cellSize: moveInput.cellSize,
    });
    this.onDashboardConfigurationChange(this.dashboardLayout);
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
    this.undoQueue.push(onResizeAction(resizeInput));
    this.redoQueue = [];
  }

  deleteWidgets(deleteInput: DeleteActionInput) {
    this.store.dispatch(onDeleteAction(deleteInput));
  }

  pasteWidgets(pasteInput: PasteActionInput) {
    this.store.dispatch(onPasteAction(pasteInput));
  }

  createWidgets = () => {
    this.store.dispatch(
      onCreateAction({
        dashboardConfiguration: this.dashboardLayout,
        widgets: [
          {
            x: 1,
            y: 1,
            z: 1,
            width: 4,
            height: 4,
            widget: 'line-chart',
            id: Math.random().toString() + new Date().toISOString(),
          },
        ],
      })
    );
    const createActionInput: CreateActionInput = {
      dashboardConfiguration: this.dashboardConfiguration,
      widgets: [
        {
          x: 1,
          y: 1,
          z: 1,
          width: 4,
          height: 4,
          widget: 'line-chart',
          id: Math.random().toString() + new Date().toISOString(),
        },
      ],
    };
    this.undoQueue.push(onCreateAction(createActionInput));
    this.redoQueue = [];
  };

  store: DashboardStore;
  componentWillLoad() {
    this.dashboardLayout = this.dashboardConfiguration;
    this.store = createStore(dashboardReducer, this.dashboardConfiguration);
    this.store.subscribe(() => {
      this.dashboardLayout = this.store.getState();
      this.onDashboardConfigurationChange(this.dashboardLayout);
    });
    //this.dashboardLayout = this.store.getState();
    this.dashboardLayout = this.dashboardConfiguration;
    this.onDashboardConfigurationChange(this.dashboardLayout);
  }

  @Watch('dashboardConfiguration')
  watchDashboardConfiguration(newDashboardConfiguration: DashboardConfiguration) {
    this.dashboardLayout = newDashboardConfiguration;
    this.onDashboardConfigurationChange(this.dashboardLayout);
  }

  render() {
    return (
      this.dashboardLayout && (
        <div>
          <button onClick={this.createWidgets}>Add widget</button>

          <iot-dashboard
            width={this.width}
            cellSize={this.cellSize}
            stretchToFit={this.stretchToFit}
            dashboardConfiguration={this.intermediateLayout || this.dashboardConfiguration}
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
