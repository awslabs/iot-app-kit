import { newSpecPage } from '@stencil/core/testing';
import { Viewport } from '@iot-app-kit/core';
import { IotStatusTimeline } from './iot-status-timeline';
import { Components } from '../../components.d';
import { IotTimeSeriesConnector } from '../iot-time-series-connector/iot-time-series-connector';
import { CustomHTMLElement } from '../../testing/types';
import { update } from '../../testing/update';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';

const viewport: Viewport = {
  duration: 1000,
};

const statusTimelineSpecPage = async (propOverrides: Partial<Components.IotStatusTimeline> = {}) => {
  const query = mockTimeSeriesDataQuery([]);

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
    queries: [query],
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
