import { Component, h, Listen, State, Prop, Method } from '@stencil/core';
import { createStore } from 'redux';
import {
  DashboardStore,
  DashboardConfiguration,
  OnResize,
  MoveActionInput,
  Position,
  Rect,
  Anchor,
  ResizeActionInput,
  onResizeAction,
} from '../../types';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { onMoveAction, MoveAction } from '../../dashboard-actions/actions';
import { getSelectedWidgetIds } from '../../dashboard-actions/select';
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

  /** The currently active gesture */
  @State() activeGesture: 'move' | 'resize' | undefined;
  /** If the active gesture is resize, this represents which anchor point the resize is being done relative to */
  @State() activeResizeAnchor: Anchor | undefined;
  /** The initial position of the cursor on the start of the resize gesture */
  @State() resizeStartPosition: Position | undefined;

  move(moveInput: MoveActionInput) {
    this.store.dispatch(onMoveAction(moveInput));
    //console.log("layout after move ", this.dashboardLayout);
    console.log('inside dashboard wrapper');
  }

  resize(resizeInput: ResizeActionInput) {
    this.store.dispatch(onResizeAction(resizeInput));
    console.log('resize from wrapper');
  }

  store: DashboardStore;
  componentWillLoad() {
    this.store = createStore(dashboardReducer, this.dashboardConfiguration);
    this.store.subscribe(() => {
      this.dashboardLayout = this.store.getState();
    });
    //console.log("comp will load");
    this.dashboardLayout = this.store.getState();
  }

  render() {
    return (
      this.dashboardLayout && (
        <div>
          <iot-dashboard
            width={this.width}
            cellSize={this.cellSize}
            stretchToFit={this.stretchToFit}
            dashboardConfiguration={this.dashboardLayout}
            onDashboardConfigurationChange={(newConfig) => {
              this.dashboardConfiguration = newConfig;
            }}
            move={(input) => this.move(input)}
            resizeWidgets={(input) => this.resize(input)}
          />
        </div>
      )
    );
  }
}
