import { mount } from '@cypress/vue';
import { h } from 'vue';
const { defineCustomElements } = require('@iot-app-kit/dashboard/loader');

defineCustomElements();

const createWidget = () => ({
  x: 1,
  y: 1,
  z: 1,
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
    'position: absolute; z-index: 1; top: 100px; left: 100px; width: 40px; height: 40px;'
  );
});

it('selects and deletes widget', () => {
  renderDashboard({ dashboardConfiguration: [createWidget()] });

  cy.get('iot-dashboard-widget').should('exist');
  cy.get('iot-dashboard-widget').click().type('{del}');
  cy.get('iot-dashboard-widget').should('not.exist');
});

it('copy and paste widget', () => {
  renderDashboard({ dashboardConfiguration: [createWidget()] });

  cy.get('iot-dashboard-widget').click().type('{cmd}c').type('{cmd}v');

  cy.get('iot-dashboard').find('iot-dashboard-widget').should('have.length', 2);
});
