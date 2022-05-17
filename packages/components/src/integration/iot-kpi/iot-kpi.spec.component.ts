import { renderChart } from '../../testing/renderChart';
import {
  mockLatestValueResponse,
  mockBatchGetAggregatedOrRawResponse,
} from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('kpi', () => {
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
    renderChart({ chartType: 'iot-kpi', settings: { resolution: '0' }, viewport: { duration: '1m' } });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot(snapshotOptions);
  });
});
