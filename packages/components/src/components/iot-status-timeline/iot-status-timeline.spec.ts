import { newSpecPage } from '@stencil/core/testing';
import { MinimalLiveViewport } from '@synchro-charts/core';
import { IotStatusTimeline } from './iot-status-timeline';
import { Components } from '../../components.d';
import { registerDataSource, initialize, SiteWiseDataStreamQuery } from '@iot-app-kit/core';
import { createMockSource } from '../../testing/createMockSource';
import { DATA_STREAM } from '../../testing/mockWidgetProperties';
import { IotConnector } from '../iot-connector/iot-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';

const viewport: MinimalLiveViewport = {
  duration: 1000,
};

const statusTimelineSpecPage = async (propOverrides: Partial<Components.IotStatusTimeline> = {}) => {
  const appKitSession = initialize({ registerDataSources: false }).session();
  appKitSession.registerDataSource(createMockSource([DATA_STREAM]));

  const page = await newSpecPage({
    components: [IotStatusTimeline, IotConnector],
    html: '<div></div>',
    supportsShadowDom: false,
  });
  const statusTimeline = page.doc.createElement(
    'iot-status-timeline'
  ) as CustomHTMLElement<Components.IotStatusTimeline>;
  const props: Partial<Components.IotStatusTimeline> = {
    appKitSession,
    widgetId: 'test-status-timeline-chart-widget',
    isEditing: false,
    queries: [
      {
        source: 'test-mock',
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      } as SiteWiseDataStreamQuery,
    ], // static casting because of legacy sw
    viewport,
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
