import { renderChart } from '../../testing/renderChart';
import { mockBatchGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('status timeline', () => {
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

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, id: assetId }));
    });
  });

  it('renders', () => {
    renderChart({
      chartType: 'iot-status-timeline',
      settings: { resolution: '0' },
      annotations: { y: [{ color: '#FF0000', comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN, value: 26 }] },
    });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot(snapshotOptions);
  });
});
