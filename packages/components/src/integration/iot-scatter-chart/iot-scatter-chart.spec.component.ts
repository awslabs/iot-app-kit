import { renderChart } from '../../testing/renderChart';
import { mockGetAggregatedOrRawResponse } from '../../testing/mocks/mockGetAggregatedOrRawResponse';
import { mockGetAssetSummary } from '../../testing/mocks/mockGetAssetSummaries';
import { ScaleConfig, ScaleType } from '@synchro-charts/core';
import { mockGetAssetModelSummary } from '../../testing/mocks/mockGetAssetModelSummary';

const SECOND_IN_MS = 1000;

const snapshotOptions = {
  clip: { x: 0, y: 0, width: 400, height: 500 },
};

describe('scatter chart', () => {
  const assetId = 'some-asset-id';
  const assetModelId = 'some-asset-model-id';

  before(() => {
    cy.intercept('/properties/aggregates?*', (req) => {
      req.reply(
        mockGetAggregatedOrRawResponse({
          startDate: new Date(req.query.startDate),
          endDate: new Date(req.query.endDate),
          resolution: req.query.resolution as string,
        })
      );
    });

    cy.intercept(`/assets/${assetId}`, (req) => {
      req.reply(mockGetAssetSummary({ assetModelId, assetId }));
    });

    cy.intercept(`/asset-models/${assetModelId}`, (req) => {
      req.reply(mockGetAssetModelSummary({ assetModelId }));
    });
  });

  it('renders', () => {
    renderChart({ chartType: 'iot-scatter-chart' });

    cy.wait(SECOND_IN_MS * 2);

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
