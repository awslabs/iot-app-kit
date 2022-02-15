import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotStatusTimeline } from './iot-status-timeline';
import { Components } from '../../components.d';
import { initialize, query, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { IotTimeSeriesConnector } from '../iot-time-series-connector.ts/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const statusTimelineSpecPage = async (propOverrides: Partial<Components.IotStatusTimeline> = {}) => {
  const appKit = initialize({
    registerDataSources: false,
    iotSiteWiseClient: mockSiteWiseSDK,
  });
  appKit.registerTimeSeriesDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotStatusTimeline, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusTimeline = page.doc.createElement(
    'iot-status-timeline'
  ) as CustomHTMLElement<Components.IotStatusTimeline>;
  const props: Partial<Components.IotStatusTimeline> = {
    appKit,
    widgetId: 'test-status-timeline-chart-widget',
    isEditing: false,
    viewport,
    queries: [
      query.iotsitewise.timeSeriesData([
        { assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] },
      ]),
    ],
    ...propOverrides,
  };
  update(statusTimeline, props);
  page.body.appendChild(statusTimeline);

  await page.waitForChanges();

  return { page, statusTimeline };
};

it('renders', async () => {
  const { statusTimeline } = await statusTimelineSpecPage();
  const statusTimelines = statusTimeline.querySelectorAll('sc-status-timeline');
  expect(statusTimelines.length).toBe(1);
});
