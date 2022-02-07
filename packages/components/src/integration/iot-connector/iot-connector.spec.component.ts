import { renderChart, testChartContainerClassNameSelector } from '@iot-app-kit/components/src/testing/renderChart';
import { SECOND_IN_MS } from '@iot-app-kit/core/src/common/time';
import { mockGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('handles gestures', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
    cy.intercept('/properties/history?*', (req) => {
      req.reply(
        mockGetAggregatedOrRawResponse({
          startDate: new Date(req.query.startDate),
          endDate: new Date(req.query.endDate),
        })
      );
    });

    cy.intercept('/properties/aggregates?*', (req) => {
      req.reply(
        mockGetAggregatedOrRawResponse({
          startDate: new Date(req.query.startDate),
          endDate: new Date(req.query.endDate),
          resolution: req.query.resolution as string,
        })
      );
    });

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, id: assetId }));
    });
  });

  it('zooms in and out', () => {
    renderChart();

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot('zooms in', snapshotOptions);

    cy.wait(SECOND_IN_MS * 2);

    cy.get(testChartContainerClassNameSelector).dblclick({ shiftKey: true });

    cy.wait(SECOND_IN_MS * 2);

    cy.get(testChartContainerClassNameSelector).dblclick({ shiftKey: true });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot('zooms out', snapshotOptions);
  });

  // TODO: Panning - can not get the chart to pan with cypress trigger https://docs.cypress.io/api/commands/trigger#Usage
});
