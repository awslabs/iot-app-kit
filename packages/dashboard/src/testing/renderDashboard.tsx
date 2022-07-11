import { mount } from '@cypress/vue';
import { h } from 'vue';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
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
        <iot-dashboard
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
