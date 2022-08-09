import { renderContextMenu } from '../testing/renderContextMenu';
import { renderDashboard } from '../testing/renderDashboard';
import { Widget } from '../types';

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 1000, height: 1000 },
};

const createWidget = (partialWidget?: Partial<Widget>): Widget => ({
  x: 1,
  y: 1,
  z: 1,
  width: 4,
  height: 4,
  componentTag: 'line-chart',
  queries: [],
  id: Math.random().toString() + new Date().toISOString(),
  ...partialWidget,
});

it('renders a context menu on right click', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });

  // Select the grid area of the dashboard.
  cy.get('iot-dashboard-internal').children().first().rightclick();

  cy.get('iot-context-menu').should('be.visible');
});

it('copies and pastes a widget from the menu', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });

  cy.get('iot-dashboard-widget').click();
  cy.get('body').type('{cmd}c', { release: true });
  // Select the grid area of the dashboard.
  cy.get('iot-dashboard-internal').children().first().rightclick();

  cy.get('iot-context-menu-option').contains('Paste').click();
  cy.get('iot-dashboard-internal').find('iot-dashboard-widget').should('have.length', 2);
});

it('selects and deletes a widget from the menu', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [createWidget()],
    },
  });

  cy.get('iot-dashboard-widget').click();
  // Select the grid area of the dashboard.
  cy.get('iot-dashboard-internal').children().first().rightclick();

  cy.get('iot-context-menu-option').contains('Delete').click();
  cy.get('iot-dashboard-internal').find('iot-dashboard-widget').should('have.length', 0);
});

it('brings an item to the front and send an item to back from the menu', () => {
  renderDashboard({
    dashboardConfiguration: {
      viewport: { duration: '5m' },
      widgets: [
        createWidget({ x: 1, y: 1, height: 20, width: 20 }),
        createWidget({ x: 19, y: 19, height: 20, width: 20 }),
      ],
    },
  });

  cy.get('iot-dashboard-widget').first().click();
  // Select the grid area of the dashboard.
  cy.get('iot-dashboard-internal').children().first().rightclick();

  cy.get('iot-context-menu-option').contains('Bring to Front').click();

  cy.get('iot-dashboard-widget').should(($el) => {
    const [first, second] = [...$el].map((el) => parseInt(el.style.zIndex));
    expect(first).to.be.greaterThan(second);
  });

  cy.get('iot-dashboard-internal').children().first().rightclick();

  cy.get('iot-context-menu-option').contains('Send to Back').click();

  cy.get('iot-dashboard-widget').should(($el) => {
    const [first, second] = [...$el].map((el) => parseInt(el.style.zIndex));
    expect(first).to.be.lessThan(second);
  });
});

it('renders', () => {
  renderContextMenu();
  cy.get('#context-menu-target').rightclick();

  cy.matchImageSnapshot(snapshotOptions);
});
