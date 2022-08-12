import { Component, h, Prop } from '@stencil/core';
import {
  MoveActionInput,
  onMoveAction,
  ResizeActionInput,
  onResizeAction,
  onDeleteAction,
  DeleteActionInput,
  onPasteAction,
  onCopyAction,
  onCreateAction,
  onUndoAction,
  onRedoAction,
  onSelectAction,
  SelectActionInput,
  onUpdateAction,
} from '../../dashboard-actions/actions';
import { DashboardState, DashboardStore, DashboardConfiguration } from '../../types';
import { getRandomWidget } from '../../testing/getRandomWidget';

@Component({
  tag: 'iot-dashboard',
  shadow: false,
})
export class IotDashboard {
  /** The configurations which determines which widgets render where with what settings. */
  @Prop() dashboardConfiguration: DashboardConfiguration;

  /** Holds all necessary information about dashboard */
  @Prop() state: DashboardState;

  /** App Redux store */
  @Prop() store: DashboardStore;

  /** Calls reducer to move widgets  */
  move(moveInput: MoveActionInput) {
    this.store.dispatch(onMoveAction(moveInput));
  }

  /** Calls reducer to resize widgets  */
  resize(resizeInput: ResizeActionInput) {
    this.store.dispatch(onResizeAction(resizeInput));
  }

  /** Calls reducer to delete widgets  */
  deleteWidgets(deleteInput: DeleteActionInput) {
    this.store.dispatch(onDeleteAction(deleteInput));
  }

  /** Calls reducer to paste widgets  */
  pasteWidgets() {
    this.store.dispatch(onPasteAction());
  }

  /** Calls reducer to copy widgets  */
  copyWidgets() {
    this.store.dispatch(onCopyAction());
  }

  /** Calls reducer to create widgets  */
  createWidgets = () => {
    this.store.dispatch(onCreateAction({ widgets: [getRandomWidget()] }));
  };

  /** Updates dashboard state selected widgets  */
  selectWidgets(selectInput: SelectActionInput) {
    this.store.dispatch(onSelectAction(selectInput));
  }

  undo = () => {
    this.store.dispatch(onUndoAction());
  };

  redo = () => {
    this.store.dispatch(onRedoAction());
  };

  /** Update state when minor change (like cell size) is made */
  update = (fieldsToUpdate: Partial<DashboardState>, previousField: Partial<DashboardState>) => {
    this.store.dispatch(onUpdateAction({ fieldsToUpdate, previousField }));
  };

  onCellSizeInput = (e: Event) => {
    this.update({ cellSize: Math.max((e as any).target.value, 0) }, { cellSize: this.state.cellSize });
  };

  onWidthInput = (e: Event) => {
    this.update({ width: Math.max((e as any).target.value, 0) }, { width: this.state.width });
  };

  onStretchToFit = () => {
    this.update({ stretchToFit: this.state.stretchToFit ? false : true }, { stretchToFit: this.state.stretchToFit });
  };

  render() {
    return (
      this.state.dashboardConfiguration && (
        <div>
          <div>
            <label>Cell size pixels</label>
            <input type="number" value={this.state.cellSize} onChange={this.onCellSizeInput} />
          </div>
          <br />
          <div>
            <label>Width pixels</label>
            <input type="number" value={this.state.width} onChange={this.onWidthInput} />
          </div>
          <br />
          <div>
            <label>Stretch to fit</label>
            <input type="checkbox" checked={this.state.stretchToFit} onChange={this.onStretchToFit} />
          </div>
          <button onClick={this.createWidgets}>Add widget</button>
          <button onClick={this.undo}>Undo</button>
          <button onClick={this.redo}>Redo</button>
          <iot-dashboard-internal
            width={this.state.width}
            cellSize={this.state.cellSize}
            stretchToFit={this.state.stretchToFit}
            selectedWidgetIds={this.state.selectedWidgetIds}
            dashboardConfiguration={this.state.intermediateDashboardConfiguration || this.state.dashboardConfiguration}
            move={(input) => this.move(input)}
            resizeWidgets={(input) => this.resize(input)}
            deleteWidgets={(input) => this.deleteWidgets(input)}
            pasteWidgets={() => this.pasteWidgets()}
            copyWidgets={() => this.copyWidgets()}
            undo={() => this.undo()}
            redo={() => this.redo()}
            selectWidgets={(input) => this.selectWidgets(input)}
          />
        </div>
      )
    );
  }
}
