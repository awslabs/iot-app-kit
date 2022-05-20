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
    cy.intercept('/properties/batch/aggregates', (req) => {
      const { startDate, endDate, resolution } = req.body.entries[0];
      const startDateInMs = startDate * SECOND_IN_MS;
      const endDateInMs = endDate * SECOND_IN_MS;

      if (new Date(startDateInMs).getUTCFullYear() === 1899) {
        req.reply(
          mockGetAggregatedOrRawResponse({
            startDate: new Date(new Date(endDateInMs).getTime() - 60 * SECOND_IN_MS),
            endDate: new Date(endDateInMs),
            resolution,
          })
        );
      } else {
        req.reply(
          mockGetAggregatedOrRawResponse({
            startDate: new Date(startDateInMs),
            endDate: new Date(endDateInMs),
            resolution,
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
