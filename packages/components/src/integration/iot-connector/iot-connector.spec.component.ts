import { renderChart, testChartContainerClassNameSelector } from '../../testing/renderChart';
import { mockBatchGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { mockGetAssetModelSummary } from '../../testing/mocks/mockGetAssetModelSummary';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('handles gestures', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
    cy.intercept('/properties/batch/history', (req) => {
      const { startDate, endDate } = req.body.entries[0];
      const startDateInMs = startDate * SECOND_IN_MS;
      const endDateInMs = endDate * SECOND_IN_MS;

      if (new Date(startDateInMs).getUTCFullYear() === 1899) {
        req.reply(
          mockBatchGetAggregatedOrRawResponse({
            startDate: new Date(new Date(endDateInMs).getTime() - SECOND_IN_MS),
            endDate: new Date(endDateInMs),
          })
        );
      } else {
        req.reply(
          mockBatchGetAggregatedOrRawResponse({
            startDate: new Date(startDateInMs),
            endDate: new Date(endDateInMs),
            entryId: '1-0',
          })
        );
      }
    });

    cy.intercept('/properties/batch/aggregates', (req) => {
      const { startDate, endDate, resolution } = req.body.entries[0];
      const startDateInMs = startDate * SECOND_IN_MS;
      const endDateInMs = endDate * SECOND_IN_MS;

      if (new Date(startDateInMs).getUTCFullYear() === 1899) {
        req.reply(
          mockBatchGetAggregatedOrRawResponse({
            startDate: new Date(new Date(endDateInMs).getTime() - 60 * SECOND_IN_MS),
            endDate: new Date(endDateInMs),
            resolution,
          })
        );
      } else {
        req.reply(
          mockBatchGetAggregatedOrRawResponse({
            startDate: new Date(startDateInMs),
            endDate: new Date(endDateInMs),
            resolution,
          })
        );
      }
    }).as('getAggregates');

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, assetId }));
    }).as('getAssetSummary');

    cy.intercept(`/asset-models/${assetModelId}`, (req) => {
      req.reply(mockGetAssetModelSummary({ assetModelId }));
    }).as('getAssetModels');
  });

  it('zooms in and out', () => {
    renderChart();

    cy.wait(['@getAggregates', '@getAssetSummary', '@getAssetModels']);

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
