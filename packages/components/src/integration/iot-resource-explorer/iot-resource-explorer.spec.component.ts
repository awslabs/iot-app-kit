/// <reference types="cypress-wait-until" />
import { renderComponent, testContainerClassName } from './setup';
import { getTableDescSortedColumnSelector, setTextFilterValue } from './utils';
import { mocklistAssociatedAssetsResponse } from '../../testing/mocks/data/listAssociatedAssetsResponse';
import { mocklistAssetsResponse } from '../../testing/mocks/data/listAssetsResponse';

const TableRowSelector = `.${testContainerClassName} tbody tr`;
const TableHeaderRowSelector = `.${testContainerClassName} thead tr`;

const waitForTableRender = () => cy.get(`${TableRowSelector} > :nth-child(2)`).contains('Turbine 1'); // wait for table to load

describe('Iot Resource Explorer', () => {
  beforeEach(() => {
    cy.intercept('/assets?*', mocklistAssetsResponse);
    cy.intercept(`/assets/${mocklistAssetsResponse.assetSummaries?.[0].id}/*`, mocklistAssociatedAssetsResponse);
  });

  it('should sopport sorting by name', () => {
    renderComponent();

    // sort by name asc
    cy.get(`.${testContainerClassName}`).should('be.visible');
    cy.get(getTableDescSortedColumnSelector()).should('be.contain', 'Asset Name');
    waitForTableRender();
    cy.get(`${TableHeaderRowSelector} th > [role=button]`).contains('Asset Name').trigger('click');
    cy.get(`${TableRowSelector}:nth-child(1)`).should('be.contain', 'Turbine 1');
    cy.matchImageSnapshotOnCI('sort by name asc');
  });

  it('should support filtering by name', () => {
    renderComponent();

    cy.get(`.${testContainerClassName}`).should('be.visible');
    waitForTableRender();
    setTextFilterValue('Turbine', '[placeholder="Filter by name"]');
    cy.get(TableRowSelector).then((rows) => rows.length === 1);
    cy.matchImageSnapshotOnCI('filter by name');
  });

  it('should support selecting a row', () => {
    renderComponent();

    cy.get(`.${testContainerClassName}`).should('be.visible');
    waitForTableRender();
    cy.get(`${TableRowSelector}:last-child() > td input`).trigger('click'); // Select row
    cy.matchImageSnapshotOnCI('select row');
  });

  it('should support expanding a row', () => {
    renderComponent();

    cy.get(`.${testContainerClassName}`).should('be.visible');
    waitForTableRender();
    cy.get(`${TableRowSelector}:last-child() td`).find('button').trigger('click');
    cy.get(`${TableRowSelector}`).then((rows) => rows.length === 4);
    cy.matchImageSnapshotOnCI('expand row');
  });
});
