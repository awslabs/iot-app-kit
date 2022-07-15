import { Component, State, h } from '@stencil/core';
import { DashboardConfiguration } from '../../types';
import { concatWidgets } from '../../util/dashboardConfiguration';
import { dashboardConfig, MockWidgetFactory } from '../mocks';

const DEFAULT_CELL_SIZE = 30;
const DEFAULT_WIDTH = 1000;
const DEFAULT_STRETCH_TO_FIT = true;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
    const n = getRandomInt(1, 3);
    switch (n) {
      case 1:
        this.dashboardConfiguration = concatWidgets(this.dashboardConfiguration, [MockWidgetFactory.getKpiWidget()]);
        break;
      case 2:
        this.dashboardConfiguration = concatWidgets(this.dashboardConfiguration, [
          MockWidgetFactory.getScatterChartWidget(),
        ]);
        break;
      case 3:
        this.dashboardConfiguration = concatWidgets(this.dashboardConfiguration, [
          MockWidgetFactory.getLineChartWidget(),
        ]);
        break;
    }
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
        <iot-dashboard
          width={this.width}
          cellSize={this.cellSize}
          stretchToFit={this.stretchToFit}
          dashboardConfiguration={this.dashboardConfiguration}
          onDashboardConfigurationChange={(newConfig) => {
            this.dashboardConfiguration = newConfig;
          }}
        />
      </div>
    );
  }
}
