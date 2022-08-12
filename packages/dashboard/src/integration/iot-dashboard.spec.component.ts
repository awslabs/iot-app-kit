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
  renderDashboard();
  cy.get('iot-dashboard-widget').move({ deltaX: 100, deltaY: 100, force: true });
  cy.get('iot-dashboard-widget').should(
    'have.attr',
    'style',
    'position: absolute; z-index: 1; top: 110px; left: 110px; width: 80px; height: 50px;'
  );
});

it('selects and deletes widget', () => {
  renderDashboard();

  cy.get('iot-dashboard-widget').should('exist');
  cy.get('iot-dashboard-widget').click();
  cy.get('body').type('{del}', { release: true });
  cy.get('iot-dashboard-widget').should('not.exist');
});

it('copy and paste widget', () => {
  renderDashboard();

  cy.get('iot-dashboard-widget').click();
  cy.get('body').type('{cmd}c', { release: true }).type('{cmd}v', { release: true });
  cy.get('iot-dashboard-internal').find('iot-dashboard-widget').should('have.length', 2);
});

it('undoes and redoes a move action', () => {
  renderDashboard();
  cy.get('iot-dashboard-widget').move({ deltaX: 100, deltaY: 100, force: true });
  cy.get('body').type('{cmd}z', { release: true }).type('{cmd}{shift}z', { release: true });
  cy.get('iot-dashboard-widget').should(
    'have.attr',
    'style',
    'position: absolute; z-index: 1; top: 110px; left: 110px; width: 80px; height: 50px;'
  );
});
