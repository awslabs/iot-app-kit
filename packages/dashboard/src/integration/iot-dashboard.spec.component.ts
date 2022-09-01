import { renderDashboard } from '../testing/renderDashboard';
import { Widget } from '../types';

const createWidget = (): Widget => ({
  x: 1,
  y: 1,
  z: 1,
  width: 4,
  height: 4,
  componentTag: 'line-chart',
  queries: [],
  id: Math.random().toString() + new Date().toISOString(),
});

it('click and drag moves widget', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });
  cy.get('iot-dashboard-widget').trigger('pointerdown', { force: true, button: 0, offsetX: 25, offsetY: 40 });
  cy.get('iot-dashboard-widget').trigger('pointermove', { force: true, button: 0, offsetX: 25, offsetY: 40 });
  cy.get('iot-dashboard-widget').trigger('pointerup', { force: true, button: 0, offsetX: 125, offsetY: 140 });
  cy.get('iot-dashboard-widget').should(
    'have.attr',
    'style',
    'position: absolute; z-index: 1; top: 100px; left: 100px; width: 40px; height: 40px;'
  );
});

it('selects and deletes widget', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });

  cy.get('iot-dashboard-widget').should('exist');
  cy.get('iot-dashboard-widget').click();
  cy.get('body').type('{del}', { release: true });
  cy.get('iot-dashboard-widget').should('not.exist');
});

it('copy and paste widget', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });

  cy.get('iot-dashboard-widget').click();
  cy.get('body').type('{cmd}c', { release: true }).type('{cmd}v', { release: true });
  cy.get('iot-dashboard-internal').find('iot-dashboard-widget').should('have.length', 2);
});

it('undoes and redoes a move action', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });
  cy.get('iot-dashboard-widget').trigger('pointerdown', { force: true, button: 0, offsetX: 25, offsetY: 40 });
  cy.get('iot-dashboard-widget').trigger('pointermove', { force: true, button: 0, offsetX: 25, offsetY: 40 });
  cy.get('iot-dashboard-widget').trigger('pointerup', { force: true, button: 0, offsetX: 125, offsetY: 140 });
  cy.get('iot-dashboard').click(500, 500);
  cy.get('body').type('{cmd}z', { release: true }).type('{cmd}{shift}z', { release: true });
  cy.get('iot-dashboard-widget').should(
    'have.attr',
    'style',
    'position: absolute; z-index: 1; top: 100px; left: 100px; width: 40px; height: 40px;'
  );
});

it('clears a selection', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });

  cy.get('iot-dashboard-widget').should('exist');
  cy.get('iot-dashboard-widget').click();
  cy.get('iot-selection-box').should('exist');
  cy.get('body').type('{esc}', { release: true });
  cy.get('iot-selection-box').should('not.exist');
});
