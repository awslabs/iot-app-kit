import { Component, State, h } from '@stencil/core';
import { createStore } from 'redux';
import { DashboardState, DashboardStore, DashboardConfiguration } from '../../types';
import { dashboardConfig } from '../mocks';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { trimWidgetPosition } from '../../components/iot-dashboard/trimWidgetPosition';

const DEFAULT_STRETCH_TO_FIT = false;

const DEFAULT_CELL_SIZE = 10;
const DEFAULT_WIDTH = 1000;

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  @State() dashboardConfiguration: DashboardConfiguration = dashboardConfig;

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
    this.dashboardConfiguration = config;
  };

  store: DashboardStore;

  componentWillLoad() {
    this.state.dashboardConfiguration = this.dashboardConfiguration;
    this.store = createStore(dashboardReducer, this.state);
    this.store.subscribe(() => {
      this.state = this.store.getState();
      this.state.dashboardConfiguration.widgets = this.state.dashboardConfiguration.widgets.map(trimWidgetPosition);
      this.onDashboardConfigurationChange(this.state.dashboardConfiguration);
    });
  }

  render() {
    return (
      <div>
        <iot-resizable-panes>
          <div slot="left">
            <div class="dummy-content">Resource explorer pane</div>
          </div>
          <div slot="center">
            <iot-dashboard store={this.store} state={this.state}></iot-dashboard>
          </div>
          <div slot="right">
            <iot-annotations store={this.store} state={this.state}></iot-annotations>
            <div class="dummy-content">Component pane</div>
          </div>
        </iot-resizable-panes>
      </div>
    );
  }
}
