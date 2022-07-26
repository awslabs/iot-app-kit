import { mount } from '@cypress/vue';
import { h } from 'vue';
import { DashboardConfiguration } from '../types';

const { defineCustomElements } = require('@iot-app-kit/dashboard/loader');

defineCustomElements();

export const renderDashboard = ({
  dashboardConfiguration,
  width = 500,
  cellSize = 10,
  stretchToFit = false,
  onDashboardConfigurationChange = () => {},
}: {
  dashboardConfiguration: DashboardConfiguration;
  width: number;
  cellSize: number;
  stretchToFit: boolean;
  onDashboardConfigurationChange: any;
}) => {
  mount({
    render: function () {
      return (
        <iot-dashboard-internal
          dashboardConfiguration={dashboardConfiguration}
          width={width}
          cellSize={cellSize}
          stretchToFit={stretchToFit}
          onDashboardConfigurationChange={onDashboardConfigurationChange}
        />
      );
    },
  });
};
