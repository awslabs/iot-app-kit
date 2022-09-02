import { renderChart } from '../../testing/renderChart';
import {
  mockBatchLatestValueResponse,
  mockBatchGetAggregatedOrRawResponse,
} from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { mockGetAssetModelSummary } from '../../testing/mocks/mockGetAssetModelSummary';
import { expect } from 'chai';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('kpi', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  beforeEach(() => {
    cy.intercept('/properties/batch/history', (req) => {
      const { startDate, endDate } = req.body.entries[0];
      const startDateInMs = startDate * SECOND_IN_MS;
      const endDateInMs = endDate * SECOND_IN_MS;

      req.reply(
        mockBatchGetAggregatedOrRawResponse({
          startDate: new Date(startDateInMs),
          endDate: new Date(endDateInMs),
        })
      );
    }).as('getHistory');

    cy.intercept('/properties/batch/latest', (req) => {
      req.reply(mockBatchLatestValueResponse());
    }).as('getAggregates');

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, assetId }));
    }).as('getAssetSummary');

    cy.intercept(`/asset-models/${assetModelId}`, (req) => {
      req.reply(mockGetAssetModelSummary({ assetModelId }));
    }).as('getAssetModels');
  });

  it('renders', () => {
    renderChart({ chartType: 'iot-kpi', settings: { resolution: '0' }, viewport: { duration: '1m' } });

    cy.wait(['@getAggregates', '@getAssetSummary', '@getAssetModels', '@getHistory']);

    cy.matchImageSnapshot(snapshotOptions);
  });

  it('renders passes all props to synchro-charts', () => {
    const props = {
      widgetId: '123',
      viewport: { duration: '5m' },
      annotations: { show: true, thresholdOptions: true, colorDataAcrossThresholds: true },
      isEditing: false,
      messageOverrides: {},
    };

    renderChart({ chartType: 'iot-kpi', settings: { resolution: '0' }, ...props });

    cy.wait(SECOND_IN_MS * 2);

    cy.get('sc-kpi').should((e) => {
      const [chart] = e.get();
      (Object.keys(props) as Array<keyof typeof props>).forEach((prop) => {
        const value = chart[prop as keyof HTMLScKpiElement];
        const passedInValue = props[prop];
        expect(value).to.deep.equal(passedInValue);
      });
    });
  });
});
