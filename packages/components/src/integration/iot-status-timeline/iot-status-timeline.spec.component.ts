import { renderChart } from '../../testing/renderChart';
import { mockGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('status timeline', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
    cy.intercept('/properties/history?*', (req) => {
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

  it('renders', () => {
    renderChart({
      chartType: 'iot-status-timeline',
      settings: { resolution: '0' },
      annotations: { y: [{ color: '#FF0000', comparisonOperator: 'GT', value: 26 }] },
    });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot(snapshotOptions);
  });
});
