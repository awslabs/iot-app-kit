import { mount } from '@cypress/vue';
import { h } from 'vue';
const { defineCustomElements } = require('@iot-app-kit/dashboard/loader');

defineCustomElements();

const createWidget = () => ({
  x: 1,
  y: 1,
  width: 4,
  height: 4,
  widget: 'line-chart',
  id: Math.random().toString() + new Date().toISOString(),
});

const renderDashboard = ({
  dashboardConfiguration,
  width = 500,
  cellSize = 10,
  stretchToFit = false,
  onDashboardConfigurationChange = () => {},
}) => {
  mount({
    render: function () {
      return h('iot-dashboard', {
        dashboardConfiguration,
        width,
        cellSize,
        stretchToFit,
        onDashboardConfigurationChange,
      });
    },
  });
};

it('click and drag moves widget', () => {
  renderDashboard({ dashboardConfiguration: [createWidget()] });

  cy.get('iot-dashboard-widget').move({ deltaX: 100, deltaY: 100, force: true });
  cy.get('iot-dashboard-widget').should(
    'have.attr',
    'style',
    'position: absolute; top: 100px; left: 100px; width: 40px; height: 40px;'
  );
});
