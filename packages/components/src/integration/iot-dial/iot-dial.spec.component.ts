import { COMPARISON_OPERATOR, StatusIcon } from '@synchro-charts/core';
import {
  mockBatchGetAggregatedOrRawResponse,
  mockBatchLatestValueResponse,
} from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetModelSummary } from '../../testing/mocks/mockGetAssetModelSummary';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { renderChart } from '../../testing/renderChart';

const SECOND_IN_MS = 1000;
const yMin = 0;
const yMax = 100;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

const annotations = {
  y: [
    {
      color: '#C03F25',
      value: 33,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: 'Critical',
        show: true,
      },
      icon: StatusIcon.ERROR,
    },
    {
      color: '#F29D38',
      value: 66,
      comparisonOperator: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: 'Warning',
        show: true,
      },
      icon: StatusIcon.LATCHED,
    },
    {
      color: '#3F7E23',
      value: 66,
      comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN,
      dataStreamIds: ['car-speed-alarm'],
      label: {
        text: 'Normal',
        show: true,
      },
      icon: StatusIcon.NORMAL,
    },
  ],
  offsetX: 50,
};

describe('dial', () => {
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
    renderChart({
      chartType: 'iot-dial',
      settings: { resolution: '0' },
      size: 'L',
      viewport: { duration: '1m', yMin, yMax },
    });

    cy.wait(['@getAggregates', '@getAssetSummary', '@getAssetModels', '@getHistory']);

    cy.matchImageSnapshot(snapshotOptions);
  });

  it('renders passes all props to synchro-charts', () => {
    const props = {
      widgetId: '123',
      viewport: { duration: '5m', yMin, yMax },
      annotations,
      size: 'XXL',
      messageOverrides: {},
      significantDigits: 2,
    };

    renderChart({ chartType: 'iot-dial', settings: { resolution: '0' }, ...props });

    cy.wait(SECOND_IN_MS * 2);

    cy.get('sc-dial').should((e) => {
      const [chart] = e.get();
      (Object.keys(props) as Array<keyof typeof props>).forEach((prop) => {
        if (prop !== 'size') {
          const value = chart[prop as keyof HTMLScDialElement];
          const passedInValue = props[prop];
          expect(value).to.deep.equal(passedInValue);
        }
      });
    });
  });
});
