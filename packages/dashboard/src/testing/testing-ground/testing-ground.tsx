import { Component, State, h } from '@stencil/core';
import { DashboardConfiguration } from '../../types';
import { dashboardConfig } from '../mocks';

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  @State() dashboardConfiguration: DashboardConfiguration = dashboardConfig;

  render() {
    return (
      /**
       * This is required for touch drag and drop. Can be moved to iot-dashboard when
       * resizable panes is moved into that component.
       */
      <div style={{ touchAction: 'none' }}>
        <iot-resizable-panes>
          <div slot="left">
            <div class="dummy-content">Resource explorer pane</div>
          </div>
          <div slot="center">
            <iot-dashboard dashboardConfiguration={this.dashboardConfiguration}></iot-dashboard>
          </div>
          <div slot="right">
            <div class="dummy-content">Component pane</div>
          </div>
        </iot-resizable-panes>
        <iot-webgl-context />
      </div>
    );
  }
}
