import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotStatusTimeline } from './iot-status-timeline';
import { Components } from '../../components.d';
import { initialize } from '@iot-app-kit/source-iotsitewise';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockSiteWiseSDK } from '../../testing/mocks/siteWiseSDK';
import { mockEventsSDK } from '../../testing/mocks/eventsSDK';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const statusTimelineSpecPage = async (propOverrides: Partial<Components.IotStatusTimeline> = {}) => {
  const { query } = initialize({
    iotSiteWiseClient: mockSiteWiseSDK,
    iotEventsClient: mockEventsSDK,
  });

  const page = await newSpecPage({
    components: [IotStatusTimeline, IotTimeSeriesConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusTimeline = page.doc.createElement(
    'iot-status-timeline'
  ) as CustomHTMLElement<Components.IotStatusTimeline>;
  const props: Partial<Components.IotStatusTimeline> = {
    isEditing: false,
    viewport,
    queries: [
      query.timeSeriesData({
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      }),
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
