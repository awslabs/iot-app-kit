import { renderChart } from '../../testing/renderChart';
import {
  mockLatestValueResponse,
  mockBatchGetAggregatedOrRawResponse,
} from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('status grid', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
    cy.intercept('/properties/batch/history', (req) => {
      req.reply(
        mockBatchGetAggregatedOrRawResponse({
          startDate: new Date(req.query.startDate),
          endDate: new Date(req.query.endDate),
        })
      );
    });

    cy.intercept('/properties/latest?*', (req) => {
      req.reply(mockLatestValueResponse());
    });

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, id: assetId }));
    });
  });

  it('renders', () => {
    renderChart({
      chartType: 'iot-status-grid',
      settings: { resolution: '0' },
      viewport: { duration: '1m' },
      annotations: { y: [{ color: '#FF0000', comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN, value: 25 }] },
    });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot(snapshotOptions);
  });
});
