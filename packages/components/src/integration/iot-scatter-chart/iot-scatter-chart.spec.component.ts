import { renderChart } from '../../testing/renderChart';
import { mockBatchGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { ScaleConfig, ScaleType } from '@synchro-charts/core';
import { mockGetAssetModelSummary } from '../../testing/mocks/mockGetAssetModelSummary';
import { expect } from 'chai';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('scatter chart', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  beforeEach(() => {
    cy.intercept('/properties/batch/aggregates', (req) => {
      const { startDate, endDate, resolution } = req.body.entries[0];
      const startDateInMs = startDate * SECOND_IN_MS;
      const endDateInMs = endDate * SECOND_IN_MS;

      req.reply(
        mockBatchGetAggregatedOrRawResponse({
          startDate: new Date(startDateInMs),
          endDate: new Date(endDateInMs),
          resolution,
        })
      );
    }).as('getAggregates');

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, assetId }));
    }).as('getAssetSummary');

    cy.intercept(`/asset-models/${assetModelId}`, (req) => {
      req.reply(mockGetAssetModelSummary({ assetModelId }));
    }).as('getAssetModels');
  });

  it('renders', () => {
    renderChart({ chartType: 'iot-scatter-chart' });

    cy.wait(['@getAggregates', '@getAssetSummary', '@getAssetModels']);

    cy.matchImageSnapshot(snapshotOptions);
  });

  it('renders passes all props to synchro-charts', () => {
    const props = {
      widgetId: '123',
      viewport: { duration: '5m' },
      size: { width: 10, height: 10 },
      movement: { enableXScroll: true, enableYScroll: false, zoomMax: 10, zoomMin: 0 },
      scale: {
        xScaleType: ScaleType.TimeSeries,
        yScaleType: ScaleType.TimeSeries,
        xScaleSide: 'top',
        yScaleSide: 'left',
      } as ScaleConfig,
      layout: {
        xTicksVisible: true,
        yTicksVisible: true,
        xGridVisible: true,
        yGridVisible: true,
      },
      gestures: true,
      annotations: { show: true, thresholdOptions: true, colorDataAcrossThresholds: true },
      isEditing: false,
      trends: [],
      messageOverrides: {},
      axis: { labels: { yAxis: { content: 'yAxis' } } },
    };

    renderChart({ chartType: 'iot-scatter-chart', ...props });

    cy.wait(SECOND_IN_MS * 2);

    cy.get('sc-scatter-chart').should((e) => {
      const [chart] = e.get();
      (Object.keys(props) as Array<keyof typeof props>).forEach((prop) => {
        const value = chart[prop as keyof HTMLScScatterChartElement];
        const passedInValue = props[prop];
        expect(value).to.deep.equal(passedInValue);
      });
    });
  });
});
