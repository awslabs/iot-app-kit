/// <reference types="cypress-wait-until" />
import { renderComponent, testContainerClassName } from './setup';
import {
  getTableAscSortedColumnSelector,
  getTableCellSelector,
  getTableDescSortedColumnSelector,
  getTableRowSelector,
  getTableRowsSelector,
  getTableSelectedRowsSelector,
  setTableColumnSelectionSelector,
  setTableRowSelection,
  setTextFilterValue,
  clearInputValue,
} from './utils';
import { mocklistAssociatedAssetsResponse } from '../../testing/mocks/data/listAssociatedAssetsResponse';
import { mocklistAssetsResponse } from '../../testing/mocks/data/listAssetsResponse';

beforeEach(() => {
  cy.intercept('/assets?*', mocklistAssetsResponse);
  cy.intercept(`/assets/${mocklistAssetsResponse.assetSummaries?.[0].id}/*`, mocklistAssociatedAssetsResponse);
});

it('supports tree operations', () => {
  renderComponent();

  // sort by name asc
  cy.get(`.${testContainerClassName}`).should('be.visible');
  cy.get(getTableDescSortedColumnSelector()).should('be.contain', 'Asset Name');
  setTableColumnSelectionSelector('', 1, true);
  cy.get(getTableAscSortedColumnSelector()).should('be.contain', 'Asset Name');
  cy.get(getTableRowSelector(1)).should('be.contain', 'Turbine 1');
  cy.matchImageSnapshotOnCI('sort by name asc');

  // reset
  setTableColumnSelectionSelector('', 1, false);

  // filter by name
  cy.get(`.${testContainerClassName}`).should('be.visible');
  setTextFilterValue('Turbine', '[placeholder="Filter by name"]');
  cy.waitUntil(() => cy.get(getTableRowsSelector()).then((rows) => rows.length === 1));
  cy.matchImageSnapshotOnCI('filter by name');

  // reset
  clearInputValue('[placeholder="Filter by name"]');

  // select row
  cy.get(`.${testContainerClassName}`).should('be.visible');
  setTableRowSelection(2);
  cy.get(getTableSelectedRowsSelector()).should('be.contain', 'Turbine 1');
  cy.matchImageSnapshotOnCI('select row');

  // expand row
  cy.get(`.${testContainerClassName}`).should('be.visible');
  cy.get(getTableCellSelector(2, 2)).should('be.contain', 'Turbine 1');
  cy.get(getTableCellSelector(2, 2)).then((cell) => {
    cell.find('button').click();
  });
  cy.waitUntil(() => cy.get(getTableRowsSelector()).then((rows) => rows.length === 4));
  cy.matchImageSnapshotOnCI('expand row');
});
