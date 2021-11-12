/* eslint-disable */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to wait until a chart is done with it's initial rendering
     */
    waitForChart(): Chainable<Element>;
    waitForStatusTimeline(): Chainable<Element>;
    matchImageSnapshotOnCI(nameOrOptions?: string | Object): void;
  }
}
