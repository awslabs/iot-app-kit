import { renderChart, testChartContainerClassNameSelector } from '@iot-app-kit/components/src/testing/renderChart';
import { SECOND_IN_MS } from '@iot-app-kit/core/src/common/time';

describe('handles gestures', () => {
  it('zooms in and out', () => {
    renderChart();

    cy.wait(SECOND_IN_MS * 2);

    cy.get(testChartContainerClassNameSelector).dblclick();

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshotOnCI('zooms in');

    cy.get(testChartContainerClassNameSelector).dblclick({ shiftKey: true });

    cy.wait(SECOND_IN_MS * 2);

    cy.get(testChartContainerClassNameSelector).dblclick({ shiftKey: true });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshotOnCI('zooms out');
  });

  // TODO: Panning - can not get the chart to pan with cypress trigger https://docs.cypress.io/api/commands/trigger#Usage
})
