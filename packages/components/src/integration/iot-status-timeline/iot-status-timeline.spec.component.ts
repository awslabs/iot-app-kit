import { renderChart } from '../../testing/renderChart';
import { mockGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';
import { mockGetAssetModelSummary } from '../../testing/mocks/mockGetAssetModelSummary';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('status timeline', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
    cy.intercept('/properties/history?*', (req) => {
      if (new Date(req.query.startDate).getUTCFullYear() === 1899) {
        req.reply(
          mockGetAggregatedOrRawResponse({
            startDate: new Date(new Date(req.query.endDate).getTime() - SECOND_IN_MS),
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
    }).as('getAggregates');

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, assetId }));
    }).as('getAssetSummary');

    cy.intercept(`/asset-models/${assetModelId}`, (req) => {
      req.reply(mockGetAssetModelSummary({ assetModelId }));
    }).as('getAssetModels');
  });

  it('renders', () => {
    renderChart({
      chartType: 'iot-status-timeline',
      settings: { resolution: '0' },
      annotations: { y: [{ color: '#FF0000', comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN, value: 26 }] },
    });

    cy.wait(['@getAggregates', '@getAssetSummary', '@getAssetModels']);

    cy.matchImageSnapshot(snapshotOptions);
  });

  it('renders passes all props to synchro-charts', () => {
    const props = {
      widgetId: '123',
      viewport: { duration: '1m' },
      annotations: { y: [{ color: '#FF0000', comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN, value: 26 }] },
      isEditing: false,
    };

    renderChart({
      chartType: 'iot-status-timeline',
      settings: { resolution: '0' },
      ...props,
    });

    cy.wait(SECOND_IN_MS * 2);

    cy.get('sc-status-timeline').should((e) => {
      const [chart] = e.get();
      (Object.keys(props) as Array<keyof typeof props>).forEach((prop) => {
        const value = chart[prop as keyof HTMLScStatusTimelineElement];
        const passedInValue = props[prop];
        expect(value).to.deep.equal(passedInValue);
      });
    });
  });
});
