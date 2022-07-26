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
  CopyActionInput,
  onCopyAction,
  onCreateAction,
  UndoQueue,
  onUndoAction,
  UndoAction,
  VoidAction,
  onVoidAction,
  RedoAction,
  onRedoAction,
  CreateActionInput,
  DashboardReducerState,
  onStretchToFitAction,
  onEditCellSizeAction,
  EditCellSizeActionInput,
  EditWidthActionInput,
  onEditWidthAction,
} from '../../types';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { onMoveAction } from '../../dashboard-actions/actions';
import { move } from '../../dashboard-actions/move';
import { resize } from '../../dashboard-actions/resize';
import { reverseCreate } from '../../dashboard-actions/reverse-actions/reverseCreate';
import { reverseDelete } from '../../dashboard-actions/reverse-actions/reverseDelete';
import { dashboardConfig, MockWidgetFactory } from '../../testing/mocks';
import { getRandomWidget } from '../../dashboard-actions/createWidget';
const DEFAULT_STRETCH_TO_FIT = true;

const DEFAULT_CELL_SIZE = 30;
const DEFAULT_WIDTH = 1000;

@Component({
  tag: 'iot-dashboard',
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
   */
  //@Prop() stretchToFit: Boolean = DEFAULT_STRETCH_TO_FIT;

  /** Width of the dashboard, in pixels */
  //@Prop() width: number;

  /** Width and height of the cell, in pixels */
  //@Prop() cellSize: number = DEFAULT_CELL_SIZE;

  @Prop() addWidget: () => void;

  @State() dashboardLayout: DashboardConfiguration;
  @State() cellSize = DEFAULT_CELL_SIZE;
  @State() stretchToFit = DEFAULT_STRETCH_TO_FIT;
  @State() width = DEFAULT_WIDTH;

  /** Selection gesture */
  @State() start: Position | undefined;
  @State() end: Position | undefined;
  @State() finishedSelecting = false;
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

  @State() numTimesCopyGroupHasBeenPasted = 0;

  private prevCellSize: number;
  private prevWidth: number;
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
    this.dashboardLayout = move({
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
    this.undoQueue.push(onDeleteAction(deleteInput));
    this.redoQueue = [];
  }

  pasteWidgets() {
    const pasteInput: PasteActionInput = { numTimesPasted: 1, copyGroup: [] };
    this.store.dispatch(onPasteAction(pasteInput));
    this.undoQueue.push(onPasteAction(pasteInput));
  }

  copyWidgets(copyInput: CopyActionInput) {
    this.store.dispatch(onCopyAction(copyInput));
  }

  createWidgets = () => {
    const newWidgetID: string = Math.random().toString() + new Date().toISOString();
    this.store.dispatch(
      onCreateAction({
        dashboardConfiguration: this.dashboardLayout,
        widgets: [getRandomWidget()],
      })
    );
    const createActionInput: CreateActionInput = {
      dashboardConfiguration: this.dashboardLayout,
      widgets: [this.dashboardLayout.widgets[this.dashboardLayout.widgets.length - 1]],
    };
    this.undoQueue.push(onCreateAction(createActionInput));
    this.redoQueue = [];
  };

  undo = () => {
    const tempAction = this.undoQueue.pop();
    if (tempAction == undefined) {
      const failedUndo: VoidAction = onVoidAction();
      this.store.dispatch(failedUndo);
      return;
    } else {
      const undoInput = {
        undoAction: tempAction,
      };
      const undoAction: UndoAction = onUndoAction(undoInput);
      this.prevCellSize = this.cellSize;
      this.prevWidth = this.width;
      this.store.dispatch(undoAction);
      if (tempAction.type == 'EDITWIDTH') {
        tempAction.payload.width = this.prevWidth;
      }
      if (tempAction.type == 'EDITCELLSIZE') {
        tempAction.payload.cellSize = this.prevCellSize;
      }
      this.redoQueue.push(tempAction);
    }
  };

  redo = () => {
    const tempAction = this.redoQueue.pop();
    if (tempAction == undefined) {
      const failedRedo: VoidAction = onVoidAction();
      this.store.dispatch(failedRedo);
      return;
    } else {
      const redoInput = {
        redoAction: tempAction,
      };
      const redoAction: RedoAction = onRedoAction(redoInput);
      this.prevCellSize = this.cellSize;
      this.prevWidth = this.width;
      this.store.dispatch(redoAction);
      if (tempAction.type == 'PASTE') {
        this.undoQueue.push(
          onPasteAction({
            numTimesPasted: 1,
            copyGroup: [],
          })
        );
      }
      if (tempAction.type == 'EDITWIDTH') {
        tempAction.payload.width = this.prevWidth;
      }
      if (tempAction.type == 'EDITCELLSIZE') {
        tempAction.payload.cellSize = this.prevCellSize;
      } else {
        this.undoQueue.push(tempAction);
      }
    }
  };

  store: DashboardStore;

  componentWillLoad() {
    this.dashboardLayout = this.dashboardConfiguration;
    const tempState: DashboardReducerState = {
      dashboardConfiguration: this.dashboardLayout,
      selectedWidgetIds: this.selectedWidgetIds,
      numTimesCopyGroupHasBeenPasted: this.numTimesCopyGroupHasBeenPasted,
      copyGroup: [],
      stretchToFit: this.stretchToFit,
      width: this.width,
      cellSize: this.cellSize,
    };
    this.store = createStore(dashboardReducer, tempState);
    this.store.subscribe(() => {
      const dashState = this.store.getState();
      this.dashboardLayout = dashState.dashboardConfiguration;
      this.stretchToFit = dashState.stretchToFit;
      this.onDashboardConfigurationChange(this.dashboardLayout);
      this.width = dashState.width;
      this.cellSize = dashState.cellSize;
      this.selectedWidgetIds = dashState.selectedWidgetIds;
    });
    this.dashboardLayout = this.store.getState().dashboardConfiguration;
    this.onDashboardConfigurationChange(this.dashboardLayout);
  }

  @Watch('dashboardLayout')
  watchDashboardConfiguration(newDashboardConfiguration: DashboardConfiguration) {
    this.dashboardLayout = newDashboardConfiguration;
    this.onDashboardConfigurationChange(this.dashboardLayout);
  }

  onCellSizeInput = (e: Event) => {
    //this.cellSize = Math.max((e as any).target.value, 0);
    const prevCellSize: EditCellSizeActionInput = { cellSize: this.cellSize };
    this.undoQueue.push(onEditCellSizeAction(prevCellSize));
    const cellSize: EditCellSizeActionInput = { cellSize: Math.max((e as any).target.value, 0) };
    this.store.dispatch(onEditCellSizeAction(cellSize));
    this.redoQueue = [];
  };

  onWidthInput = (e: Event) => {
    //this.width = Math.max((e as any).target.value, 1);
    const prevWidth: EditWidthActionInput = { width: this.width };
    this.undoQueue.push(onEditWidthAction(prevWidth));
    const cellSize: EditWidthActionInput = { width: Math.max((e as any).target.value, 0) };
    this.store.dispatch(onEditWidthAction(cellSize));
    this.redoQueue = [];
  };

  onStretchToFit = (e: Event) => {
    //this.stretchToFit = (e as any).target.checked;
    this.store.dispatch(onStretchToFitAction());
    this.undoQueue.push(onStretchToFitAction());
    this.redoQueue = [];
  };

  render() {
    return (
      this.dashboardLayout && (
        <div>
          <div>
            <label>Cell size pixels</label>
            <input type="number" value={this.cellSize} onChange={this.onCellSizeInput} />
          </div>
          <br />
          <div>
            <label>Width pixels</label>
            <input type="number" value={this.width} onChange={this.onWidthInput} />
          </div>
          <br />
          <div>
            <label>Stretch to fit</label>
            <input type="checkbox" checked={this.stretchToFit} onChange={this.onStretchToFit} />
          </div>
          <button onClick={this.createWidgets}>Add widget</button>
          <button onClick={this.undo}>Undo</button>
          <button onClick={this.redo}>Redo</button>
          <iot-dashboard-internal
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
            pasteWidgets={() => this.pasteWidgets()}
            copyWidgets={(input) => this.copyWidgets(input)}
            undo={() => this.undo()}
            redo={() => this.redo()}
          />
        </div>
      )
    );
  }
}
