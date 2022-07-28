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
      <div>
        <iot-dashboard
          dashboardConfiguration={this.dashboardConfiguration}
          onDashboardConfigurationChange={(newConfig) => {
            this.dashboardConfiguration = newConfig;
          }}
        ></iot-dashboard>
      </div>
    );
  }
}
