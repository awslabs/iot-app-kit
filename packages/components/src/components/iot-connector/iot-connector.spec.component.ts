import { renderChart, testChartContainerClassNameSelector } from '@iot-app-kit/components/src/testing/renderChart';
import { SECOND_IN_MS } from '@iot-app-kit/core/src/common/time';
import { mockDataResponse } from '../../testing/mocks/response';

describe('handles gestures', () => {
  before(() => {
    cy.intercept('/properties/history?*', (req) => {
      req.reply(mockDataResponse(new Date(req.query.startDate), new Date(req.query.endDate)));
    });

    cy.intercept('/properties/aggregates?*', (req) => {
      req.reply(
        mockDataResponse(new Date(req.query.startDate), new Date(req.query.endDate), req.query.resolution as string)
      );
    });
  });

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
});
