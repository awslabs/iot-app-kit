import { renderChart } from '../../testing/renderChart';
import { mockGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('line chart', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
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

  it('renders', () => {
    renderChart({ chartType: 'iot-line-chart' });

    cy.wait(SECOND_IN_MS * 2);

    cy.matchImageSnapshot(snapshotOptions);
  });
});
