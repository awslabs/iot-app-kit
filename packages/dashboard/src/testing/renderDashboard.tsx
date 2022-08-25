import { mount } from '@cypress/vue';
import { h } from 'vue';
import { DashboardConfiguration } from '../types';
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { defineCustomElements } = require('@iot-app-kit/dashboard/loader');

defineCustomElements();

export const renderDashboard = ({ dashboardConfiguration }: { dashboardConfiguration: DashboardConfiguration }) => {
  mount({
    render: function () {
      return <iot-dashboard-grid dashboardConfiguration={dashboardConfiguration} />;
    },
  });
};
