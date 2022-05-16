import { renderChart, testChartContainerClassNameSelector } from '../../testing/renderChart';
import {
  mockGetAggregatedOrRawResponse,
  mockBatchGetAggregatedOrRawResponse,
} from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('handles gestures', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
    cy.intercept('/properties/batch/history', (req) => {
      if (new Date(req.query.startDate).getUTCFullYear() === 1899) {
        req.reply(
          mockBatchGetAggregatedOrRawResponse({
            startDate: new Date(new Date(req.query.endDate).getTime() - SECOND_IN_MS),
            endDate: new Date(req.query.endDate),
          })
        );
      } else {
        req.reply(
          mockBatchGetAggregatedOrRawResponse({
            startDate: new Date(req.query.startDate),
            endDate: new Date(req.query.endDate),
          })
        );
      }
    });

    cy.intercept('/properties/aggregates?*', (req) => {
      if (new Date(req.query.startDate).getUTCFullYear() === 1899) {
        req.reply(
          mockGetAggregatedOrRawResponse({
            startDate: new Date(new Date(req.query.endDate).getTime() - 60 * SECOND_IN_MS),
            endDate: new Date(req.query.endDate),
            resolution: req.query.resolution as string,
          })
        );
      } else {
        req.reply(
          mockGetAggregatedOrRawResponse({
            startDate: new Date(req.query.startDate),
            endDate: new Date(req.query.endDate),
            resolution: req.query.resolution as string,
          })
        );
      }
    });

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, id: assetId }));
    });
  });

  it('zooms in and out', () => {
    renderChart();

    cy.wait(SECOND_IN_MS * 2);

    cy.get(testChartContainerClassNameSelector).dblclick();

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot('zooms in', snapshotOptions);

    cy.get(testChartContainerClassNameSelector).dblclick({ shiftKey: true });

    cy.wait(SECOND_IN_MS * 2);

    cy.get(testChartContainerClassNameSelector).dblclick({ shiftKey: true });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot('zooms out', snapshotOptions);
  });

  // TODO: Panning - can not get the chart to pan with cypress trigger https://docs.cypress.io/api/commands/trigger#Usage
});
