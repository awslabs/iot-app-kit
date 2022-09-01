import { Component, h, State, Prop } from '@stencil/core';
import { createStore } from 'redux';
import merge from 'lodash/merge';
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
  onBringToFrontAction,
  onSendToBackAction,
  SendToBackActionInput,
  BringToFrontActionInput,
  PasteActionInput,
} from '../../dashboard-actions/actions';
import { DashboardState, DashboardStore, DashboardConfiguration, RecursivePartial } from '../../types';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { getRandomWidget } from '../../testing/getRandomWidget';
import { trimWidgetPosition } from './trimWidgetPosition';
import { dashboardConfig } from '../../testing/mocks';
import { DashboardMessages, DefaultDashboardMessages } from '../../messages';

const DEFAULT_STRETCH_TO_FIT = false;

const DEFAULT_CELL_SIZE = 10;
const DEFAULT_WIDTH = 1000;

@Component({
  tag: 'iot-dashboard',
  shadow: false,
})
export class IotDashboard {
  /** The configurations which determines which widgets render where with what settings. */
  @Prop() dashboardConfiguration: DashboardConfiguration;

  @Prop() messageOverrides?: RecursivePartial<DashboardMessages>;

  /** Holds all necessary information about dashboard */
  @State() state: DashboardState = {
    dashboardConfiguration: dashboardConfig,
    selectedWidgetIds: [],
    numTimesCopyGroupHasBeenPasted: 0,
    copyGroup: [],
    stretchToFit: DEFAULT_STRETCH_TO_FIT,
    width: DEFAULT_WIDTH,
    cellSize: DEFAULT_CELL_SIZE,
    intermediateDashboardConfiguration: undefined,
    undoQueue: [],
    redoQueue: [],
    previousPosition: undefined,
  };

  /**
   * Callback that is fired every time the dashboard configuration has been altered.
   *
   * When a widget is moved, resized, deleted, appended, or altered, then this method is called
   */
  onDashboardConfigurationChange = (config: DashboardConfiguration) => {
    this.state.dashboardConfiguration = config;
  };

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
  pasteWidgets(input: PasteActionInput) {
    this.store.dispatch(onPasteAction(input));
  }

  /** Calls reducer to copy widgets  */
  copyWidgets() {
    this.store.dispatch(onCopyAction());
  }

  /** Calls reducer to bring widgets to front  */
  bringWidgetsToFront(input: BringToFrontActionInput) {
    this.store.dispatch(onBringToFrontAction(input));
  }

  /** Calls reducer to send widgets to back  */
  sendWidgetsToBack(input: SendToBackActionInput) {
    this.store.dispatch(onSendToBackAction(input));
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

  store: DashboardStore;

  private messages: DashboardMessages;

  componentWillLoad() {
    this.state.dashboardConfiguration = this.dashboardConfiguration;
    this.store = createStore(dashboardReducer, this.state);
    this.store.subscribe(() => {
      this.state = this.store.getState();
      this.state.dashboardConfiguration.widgets = this.state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      this.onDashboardConfigurationChange(this.state.dashboardConfiguration);
    });
    this.messages = merge(this.messageOverrides, DefaultDashboardMessages);
  }

  /**
   * this is to resolve the 'compiler optimization issue':
   * lifecycle events not being called when not explicitly declared in at least one of components from bundle
   */
  connectedCallback() {}
  disconnectedCallback() {}

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
            copyGroup={this.state.copyGroup}
            dashboardConfiguration={this.state.intermediateDashboardConfiguration || this.state.dashboardConfiguration}
            messageOverrides={this.messages}
            move={(input) => this.move(input)}
            resizeWidgets={(input) => this.resize(input)}
            deleteWidgets={(input) => this.deleteWidgets(input)}
            pasteWidgets={(input) => this.pasteWidgets(input)}
            copyWidgets={() => this.copyWidgets()}
            bringToFront={(input) => this.bringWidgetsToFront(input)}
            sendToBack={(input) => this.sendWidgetsToBack(input)}
            undo={() => this.undo()}
            redo={() => this.redo()}
            selectWidgets={(input) => this.selectWidgets(input)}
          />
        </div>
      )
    );
  }
}
