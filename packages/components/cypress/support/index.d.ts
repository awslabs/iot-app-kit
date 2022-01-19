/* eslint-disable */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to wait until a chart is done with it's initial rendering
     */
    matchImageSnapshotOnCI(nameOrOptions?: string | Object): void;
  }
}
