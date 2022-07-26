import { mount } from '@cypress/vue';
import { h } from 'vue';
<<<<<<< HEAD
=======
import { DashboardConfiguration } from '../types';
>>>>>>> abdbc703d42dd2b7f41119a37e7a910d5fc1a1d2

const { defineCustomElements } = require('@iot-app-kit/dashboard/loader');

defineCustomElements();

export const renderDashboard = ({
  dashboardConfiguration,
  width = 500,
  cellSize = 10,
  stretchToFit = false,
  onDashboardConfigurationChange = () => {},
}: {
  dashboardConfiguration: any;
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
