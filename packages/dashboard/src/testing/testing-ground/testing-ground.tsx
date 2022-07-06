import { Component, State, h } from '@stencil/core';
import { IotDashboardWrapper } from '../../components/iot-dashboard/iot-dashboard-wrapper';
import {
  DashboardConfiguration,
  DashboardStore,
  MoveActionInput,
  onMoveAction,
  ResizeActionInput,
  onResizeAction,
} from '../../types';
import { dashboardConfig } from './mockDashboardConfiguration';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { createStore } from 'redux';

const DEFAULT_CELL_SIZE = 30;
const DEFAULT_WIDTH = 1000;
const DEFAULT_STRETCH_TO_FIT = true;

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  @State() dashboardConfiguration: DashboardConfiguration = dashboardConfig;
  @State() cellSize = DEFAULT_CELL_SIZE;
  @State() stretchToFit = DEFAULT_STRETCH_TO_FIT;
  @State() width = DEFAULT_WIDTH;

  addWidget = () => {
    this.dashboardConfiguration = [
      ...this.dashboardConfiguration,
      {
        x: 1,
        y: 1,
        width: 4,
        height: 4,
        widget: 'line-chart',
        id: Math.random().toString() + new Date().toISOString(),
      },
    ];
  };

  onCellSizeInput = (e: Event) => {
    this.cellSize = Math.max((e as any).target.value, 0);
  };

  onWidthInput = (e: Event) => {
    this.width = Math.max((e as any).target.value, 1);
  };

  onStretchToFit = (e: Event) => {
    this.stretchToFit = (e as any).target.checked;
  };
  move(moveInput: MoveActionInput) {
    this.store.dispatch(onMoveAction(moveInput));
  }
  resize(resizeInput: ResizeActionInput) {
    this.store.dispatch(onResizeAction(resizeInput));
  }

  store: DashboardStore;
  componentWillLoad() {
    this.store = createStore(dashboardReducer, this.dashboardConfiguration);
    this.store.subscribe(() => {
      this.dashboardConfiguration = this.store.getState();
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.addWidget}>Add widget</button>
        <br />
        <br />
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
        <iot-dashboard-wrapper
          width={this.width}
          cellSize={this.cellSize}
          stretchToFit={this.stretchToFit}
          dashboardConfiguration={this.dashboardConfiguration}
          onDashboardConfigurationChange={(newConfig) => {
            this.dashboardConfiguration = newConfig;
          }}
        ></iot-dashboard-wrapper>
      </div>
    );
  }
}
