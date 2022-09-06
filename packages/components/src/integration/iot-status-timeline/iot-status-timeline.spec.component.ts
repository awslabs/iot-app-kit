import { renderChart } from '../../testing/renderChart';
import { mockBatchGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';
import { mockGetAssetModelSummary } from '../../testing/mocks/mockGetAssetModelSummary';
import { expect } from 'chai';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('status timeline', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  beforeEach(() => {
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
